"use client";
import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { Upload, X, Loader2 } from "lucide-react";
import { showToast } from "@/components/ui/toast";

interface Photo {
  id: string;
  url: string;
  filename: string;
  order: number;
}

interface Props {
  carId: string;
  initialPhotos: Photo[];
  canEdit: boolean;
}

export function PhotoManager({ carId, initialPhotos, canEdit }: Props) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (valid.length === 0) {
      showToast("Selecciona archivos de imagen", "error");
      return;
    }

    setUploading(true);
    setProgress({});
    try {
      const uploaded: { url: string; pathname: string }[] = [];
      for (let i = 0; i < valid.length; i++) {
        const file = valid[i];
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const safeName = `${Date.now()}-${i}.${ext}`;
        const pathname = `cars/${carId}/${safeName}`;

        const blob = await upload(pathname, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
          clientPayload: JSON.stringify({ carId }),
          onUploadProgress: ({ percentage }) => {
            setProgress((prev) => ({ ...prev, [i]: percentage }));
          },
        });
        uploaded.push({ url: blob.url, pathname: blob.pathname });
      }

      const res = await fetch(`/api/cars/${carId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: uploaded }),
      });
      const text = await res.text();
      let data: { photos?: Photo[]; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          `El servidor devolvió una respuesta inesperada (${res.status}): ${text.slice(0, 200) || "respuesta vacía"}`,
        );
      }
      if (!res.ok) throw new Error(data.error || `Error ${res.status} al registrar fotos`);
      if (data.photos) setPhotos(data.photos);
      showToast(`${valid.length} foto(s) subida(s)`, "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error al subir fotos", "error");
    } finally {
      setUploading(false);
      setProgress({});
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function deletePhoto(photoId: string) {
    if (!confirm("¿Eliminar esta foto?")) return;
    setDeletingId(photoId);
    try {
      const res = await fetch(`/api/cars/${carId}/photos/${photoId}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Error al eliminar");
      }
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      showToast("Foto eliminada", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error al eliminar", "error");
    } finally {
      setDeletingId(null);
    }
  }

  const totalProgress = Object.keys(progress).length > 0
    ? Math.round(
        Object.values(progress).reduce((a, b) => a + b, 0) / Object.keys(progress).length,
      )
    : 0;

  return (
    <div className="space-y-4">
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {photos.map((photo, i) => (
            <div key={photo.id} className="relative group aspect-square">
              <img src={photo.url} alt="" className="h-full w-full rounded-lg object-cover" />
              {canEdit && (
                <button
                  type="button"
                  onClick={() => deletePhoto(photo.id)}
                  disabled={deletingId === photo.id}
                  className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  aria-label="Eliminar foto"
                >
                  {deletingId === photo.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </button>
              )}
              {i === 0 && (
                <span className="absolute bottom-1 left-1 rounded-sm bg-blue-600 px-1 py-0.5 text-[10px] text-white">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {canEdit && (
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
            uploading ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400"
          }`}
          onClick={() => !uploading && fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (!uploading) uploadFiles(e.dataTransfer.files);
          }}
        >
          {uploading ? (
            <>
              <Loader2 className="mx-auto h-8 w-8 text-blue-500 mb-2 animate-spin" />
              <p className="text-sm font-medium text-blue-600">
                Subiendo fotos... {totalProgress > 0 && `${totalProgress}%`}
              </p>
              {totalProgress > 0 && (
                <div className="mt-2 mx-auto max-w-xs h-1 bg-gray-200 rounded overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${totalProgress}%` }} />
                </div>
              )}
            </>
          ) : (
            <>
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">Arrastra fotos o haz clic para añadir</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Hasta 25 MB por foto</p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => uploadFiles(e.target.files)}
          />
        </div>
      )}

      {photos.length === 0 && !canEdit && (
        <p className="text-sm text-gray-400 italic">Este coche no tiene fotos.</p>
      )}
    </div>
  );
}

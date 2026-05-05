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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  function cancelUpload() {
    abortRef.current?.abort();
  }

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (valid.length === 0) {
      showToast("Selecciona archivos de imagen", "error");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setUploading(true);
    setProgress({});
    setTotalCount(valid.length);
    try {
      const uploaded: { url: string; pathname: string }[] = [];
      for (let i = 0; i < valid.length; i++) {
        if (controller.signal.aborted) throw new Error("Subida cancelada");
        const file = valid[i];
        setActiveIndex(i);
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const safeName = `${Date.now()}-${i}.${ext}`;
        const pathname = `cars/${carId}/${safeName}`;

        const blob = await upload(pathname, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
          clientPayload: JSON.stringify({ carId }),
          multipart: true,
          abortSignal: controller.signal,
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
      setActiveIndex(null);
      setTotalCount(0);
      abortRef.current = null;
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

  const currentPct = activeIndex !== null ? progress[activeIndex] ?? 0 : 0;

  return (
    <div className="space-y-4">
      {uploading && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-900">
              Subiendo foto {(activeIndex ?? 0) + 1} de {totalCount} · {Math.round(currentPct)}%
            </p>
            <button
              type="button"
              onClick={cancelUpload}
              className="text-xs font-medium text-red-600 hover:text-red-800"
            >
              Cancelar
            </button>
          </div>
          <div className="h-2 bg-blue-100 rounded overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${currentPct}%` }}
            />
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {photos.map((photo, i) => (
            <div key={photo.id} className="relative group aspect-square">
              <img src={photo.url} alt="" className="h-full w-full rounded-lg object-cover" />
              {canEdit && !uploading && (
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
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            uploading
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-blue-400 cursor-pointer"
          }`}
          onClick={() => !uploading && fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (!uploading) uploadFiles(e.dataTransfer.files);
          }}
        >
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-600">Arrastra fotos o haz clic para añadir</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Hasta 25 MB por foto</p>
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

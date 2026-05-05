"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast";
import { CAR_BRANDS, FUEL_TYPES, TRANSMISSIONS, calculateFinalPrice, formatPrice } from "@/lib/utils";
import { Upload, X, Loader2 } from "lucide-react";

interface CarFormProps {
  initialData?: Partial<CarFormData>;
  onSuccess?: (carId: string) => void;
  isAdmin?: boolean;
  showMarkup?: boolean;
}

interface CarFormData {
  title: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  color: string;
  fuelType: string;
  transmission: string;
  engine: string;
  doors: string;
  description: string;
  basePrice: string;
  markup: string;
  comment: string;
}

function makeUploadId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function CarForm({ initialData, onSuccess, isAdmin = false, showMarkup = false }: CarFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadId] = useState(makeUploadId);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<number, number>>({});
  const [errors, setErrors] = useState<Partial<CarFormData>>({});

  const [form, setForm] = useState<CarFormData>({
    title: initialData?.title || "",
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    year: initialData?.year?.toString() || new Date().getFullYear().toString(),
    mileage: initialData?.mileage?.toString() || "",
    color: initialData?.color || "",
    fuelType: initialData?.fuelType || "",
    transmission: initialData?.transmission || "",
    engine: initialData?.engine || "",
    doors: initialData?.doors?.toString() || "",
    description: initialData?.description || "",
    basePrice: initialData?.basePrice?.toString() || "",
    markup: initialData?.markup?.toString() || "30",
    comment: initialData?.comment || "",
  });

  const finalPrice = form.basePrice && form.markup
    ? calculateFinalPrice(parseFloat(form.basePrice), parseFloat(form.markup))
    : 0;

  function set(field: keyof CarFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<CarFormData> = {};
    if (!form.title.trim()) errs.title = "El título es obligatorio";
    if (!form.brand) errs.brand = "La marca es obligatoria";
    if (!form.model.trim()) errs.model = "El modelo es obligatorio";
    if (!form.year || isNaN(Number(form.year))) errs.year = "El año es obligatorio";
    if (!form.basePrice || isNaN(Number(form.basePrice))) errs.basePrice = "El precio base es obligatorio";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setPhotos((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    setProgress((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const uploadedPhotos: { url: string; pathname: string }[] = [];
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const safeName = `${Date.now()}-${i}.${ext}`;
        const pathname = `cars/uploads/${uploadId}/${safeName}`;

        const blob = await upload(pathname, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
          clientPayload: JSON.stringify({ uploadId }),
          onUploadProgress: ({ percentage }) => {
            setProgress((prev) => ({ ...prev, [i]: percentage }));
          },
        });
        uploadedPhotos.push({ url: blob.url, pathname: blob.pathname });
      }

      const payload: Record<string, unknown> = {
        title: form.title,
        brand: form.brand,
        model: form.model,
        year: parseInt(form.year),
        basePrice: parseFloat(form.basePrice),
      };
      if (form.mileage) payload.mileage = parseInt(form.mileage);
      if (form.color) payload.color = form.color;
      if (form.fuelType) payload.fuelType = form.fuelType;
      if (form.transmission) payload.transmission = form.transmission;
      if (form.engine) payload.engine = form.engine;
      if (form.doors) payload.doors = parseInt(form.doors);
      if (form.description) payload.description = form.description;
      if (isAdmin || showMarkup) payload.markup = parseFloat(form.markup);
      if (form.comment) payload.comment = form.comment;
      if (uploadedPhotos.length > 0) payload.photos = uploadedPhotos;

      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let data: { id?: string; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          `El servidor devolvió una respuesta inesperada (${res.status}): ${text.slice(0, 200) || "respuesta vacía"}`,
        );
      }
      if (!res.ok) throw new Error(data.error || `Error ${res.status} al crear el coche`);

      showToast("Coche enviado correctamente. Pendiente de aprobación.", "success");
      if (onSuccess) {
        onSuccess(data.id!);
      } else {
        router.refresh();
        router.back();
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error desconocido", "error");
    } finally {
      setLoading(false);
    }
  }

  const yearOptions = Array.from({ length: 40 }, (_, i) => {
    const y = new Date().getFullYear() + 1 - i;
    return { value: y.toString(), label: y.toString() };
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Información básica</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Título del anuncio *"
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Ej: BMW Serie 3 320d Sport 2022"
              error={errors.title}
            />
          </div>
          <Select
            label="Marca *"
            id="brand"
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            options={CAR_BRANDS.map((b) => ({ value: b, label: b }))}
            placeholder="Seleccionar marca"
            error={errors.brand}
          />
          <Input
            label="Modelo *"
            id="model"
            value={form.model}
            onChange={(e) => set("model", e.target.value)}
            placeholder="Ej: Serie 3 320d"
            error={errors.model}
          />
          <Select
            label="Año *"
            id="year"
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            options={yearOptions}
            error={errors.year}
          />
          <Input
            label="Kilometraje"
            id="mileage"
            type="number"
            value={form.mileage}
            onChange={(e) => set("mileage", e.target.value)}
            placeholder="Ej: 45000"
          />
          <Input
            label="Color"
            id="color"
            value={form.color}
            onChange={(e) => set("color", e.target.value)}
            placeholder="Ej: Negro"
          />
          <Input
            label="Motor"
            id="engine"
            value={form.engine}
            onChange={(e) => set("engine", e.target.value)}
            placeholder="Ej: 2.0 TDI 190cv"
          />
          <Select
            label="Combustible"
            id="fuelType"
            value={form.fuelType}
            onChange={(e) => set("fuelType", e.target.value)}
            options={FUEL_TYPES.map((f) => ({ value: f, label: f }))}
            placeholder="Seleccionar"
          />
          <Select
            label="Transmisión"
            id="transmission"
            value={form.transmission}
            onChange={(e) => set("transmission", e.target.value)}
            options={TRANSMISSIONS.map((t) => ({ value: t, label: t }))}
            placeholder="Seleccionar"
          />
          <Select
            label="Puertas"
            id="doors"
            value={form.doors}
            onChange={(e) => set("doors", e.target.value)}
            options={["2", "3", "4", "5"].map((d) => ({ value: d, label: d }))}
            placeholder="Seleccionar"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Descripción</h3>
        <Textarea
          label="Descripción del vehículo"
          id="description"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe el estado, equipamiento, historial de mantenimiento..."
          className="min-h-[120px]"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Precio</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Precio base (€) *"
            id="basePrice"
            type="number"
            step="0.01"
            value={form.basePrice}
            onChange={(e) => set("basePrice", e.target.value)}
            placeholder="0.00"
            error={errors.basePrice}
          />
          {(isAdmin || showMarkup) && (
            <Input
              label="Margen (%)"
              id="markup"
              type="number"
              step="0.1"
              value={form.markup}
              onChange={(e) => set("markup", e.target.value)}
            />
          )}
          {form.basePrice && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                {isAdmin || showMarkup ? "Precio final (€)" : "Precio de venta (€)"}
              </label>
              <div className="flex h-10 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-blue-700">
                {formatPrice(finalPrice)}
              </div>
              {!isAdmin && (
                <p className="text-xs text-gray-500">Incluye un margen del {form.markup}%</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Fotos</h3>
        <div
          className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => !loading && fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); if (!loading) handleFiles(e.dataTransfer.files); }}
        >
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-600">Arrastra fotos o haz clic para subir</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP · Hasta 25 MB por foto</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={loading}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
        {photoPreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {photoPreviews.map((src, i) => (
              <div key={i} className="relative group aspect-square">
                <img src={src} alt="" className="h-full w-full rounded-lg object-cover" />
                {loading && progress[i] !== undefined && progress[i] < 100 && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${progress[i]}%` }}
                    />
                  </div>
                )}
                {loading && progress[i] === 100 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  </div>
                )}
                {!loading && (
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 rounded-full bg-red-600 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 rounded-sm bg-blue-600 px-1 py-0.5 text-[10px] text-white">Principal</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Comentario</h3>
        <Textarea
          label="Notas adicionales (visible solo para el equipo)"
          id="comment"
          value={form.comment}
          onChange={(e) => set("comment", e.target.value)}
          placeholder="Información interna sobre el vehículo, historial, notas de importación..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Enviar para revisión
        </Button>
      </div>
    </form>
  );
}

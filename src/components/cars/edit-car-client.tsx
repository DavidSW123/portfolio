"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast";
import {
  CAR_BRANDS,
  FUEL_TYPES,
  TRANSMISSIONS,
  calculateFinalPrice,
  formatPrice,
} from "@/lib/utils";
import { PhotoManager } from "./photo-manager";

interface Photo {
  id: string;
  url: string;
  filename: string;
  order: number;
}

interface CarData {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage?: number | null;
  color?: string | null;
  fuelType?: string | null;
  transmission?: string | null;
  engine?: string | null;
  doors?: number | null;
  description?: string | null;
  basePrice: number;
  markup: number;
  finalPrice: number;
  photos: Photo[];
}

interface Props {
  car: CarData;
  isAdmin: boolean;
}

export function EditCarClient({ car, isAdmin }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: car.title,
    brand: car.brand,
    model: car.model,
    year: car.year.toString(),
    mileage: car.mileage?.toString() || "",
    color: car.color || "",
    fuelType: car.fuelType || "",
    transmission: car.transmission || "",
    engine: car.engine || "",
    doors: car.doors?.toString() || "",
    description: car.description || "",
    basePrice: car.basePrice.toString(),
    markup: car.markup.toString(),
  });

  const finalPrice =
    form.basePrice && form.markup
      ? calculateFinalPrice(parseFloat(form.basePrice), parseFloat(form.markup))
      : 0;

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        title: form.title,
        brand: form.brand,
        model: form.model,
        year: parseInt(form.year),
        mileage: form.mileage ? parseInt(form.mileage) : undefined,
        color: form.color || undefined,
        fuelType: form.fuelType || undefined,
        transmission: form.transmission || undefined,
        engine: form.engine || undefined,
        doors: form.doors ? parseInt(form.doors) : undefined,
        description: form.description || undefined,
        basePrice: parseFloat(form.basePrice),
      };
      if (isAdmin) body.markup = parseFloat(form.markup);

      const res = await fetch(`/api/cars/${car.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      showToast("Cambios guardados", "success");
      router.refresh();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error", "error");
    } finally {
      setSaving(false);
    }
  }

  const yearOptions = Array.from({ length: 40 }, (_, i) => {
    const y = new Date().getFullYear() + 1 - i;
    return { value: y.toString(), label: y.toString() };
  });

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Fotos</h2>
        <PhotoManager carId={car.id} initialPhotos={car.photos} canEdit={true} />
      </div>

      <form onSubmit={save} className="bg-white rounded-xl border border-gray-200 p-6 space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Información básica</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input label="Título *" id="title" value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <Select
              label="Marca *"
              id="brand"
              value={form.brand}
              onChange={(e) => set("brand", e.target.value)}
              options={CAR_BRANDS.map((b) => ({ value: b, label: b }))}
            />
            <Input label="Modelo *" id="model" value={form.model} onChange={(e) => set("model", e.target.value)} />
            <Select label="Año *" id="year" value={form.year} onChange={(e) => set("year", e.target.value)} options={yearOptions} />
            <Input label="Kilometraje" id="mileage" type="number" value={form.mileage} onChange={(e) => set("mileage", e.target.value)} />
            <Input label="Color" id="color" value={form.color} onChange={(e) => set("color", e.target.value)} />
            <Input label="Motor" id="engine" value={form.engine} onChange={(e) => set("engine", e.target.value)} />
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
            label="Descripción"
            id="description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
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
            />
            {isAdmin && (
              <Input
                label="Margen (%)"
                id="markup"
                type="number"
                step="0.1"
                value={form.markup}
                onChange={(e) => set("markup", e.target.value)}
              />
            )}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Precio final (€)</label>
              <div className="flex h-10 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-blue-700">
                {formatPrice(finalPrice)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}

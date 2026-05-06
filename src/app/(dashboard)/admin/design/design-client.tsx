"use client";
import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Image as ImageIcon, Type, Tag, Upload, RotateCcw, Loader2, Save, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast";
import type { AssetSlot, TextSlot } from "@/lib/design-slots";

interface AssetState {
  url: string;
  pathname: string;
  type: string;
  updatedAt: string;
}
interface TextState {
  value: string;
  updatedAt: string;
}

interface Props {
  slotsAssets: AssetSlot[];
  slotsTexts: TextSlot[];
  initialAssets: Record<string, AssetState>;
  initialTexts: Record<string, TextState>;
}

const BRAND_SLUGS = new Set(["site.logo", "site.favicon", "brand.name", "brand.tagline", "home.marquee.brands"]);

export function DesignClient({ slotsAssets, slotsTexts, initialAssets, initialTexts }: Props) {
  const [tab, setTab] = useState<"media" | "text" | "brand">("media");
  const [assets, setAssets] = useState(initialAssets);
  const [texts, setTexts] = useState(initialTexts);
  const [previewKey, setPreviewKey] = useState(0);
  const [previewTarget, setPreviewTarget] = useState<"/" | "/catalog">("/");

  const mediaSlots = slotsAssets.filter((s) => !BRAND_SLUGS.has(s.slug));
  const brandAssetSlots = slotsAssets.filter((s) => BRAND_SLUGS.has(s.slug));
  const textOnlySlots = slotsTexts.filter((s) => !BRAND_SLUGS.has(s.slug));
  const brandTextSlots = slotsTexts.filter((s) => BRAND_SLUGS.has(s.slug));

  function refreshPreview() {
    setPreviewKey((k) => k + 1);
  }

  function onAssetUpdated(slug: string, asset: AssetState | null) {
    setAssets((prev) => {
      const next = { ...prev };
      if (asset) next[slug] = asset;
      else delete next[slug];
      return next;
    });
    refreshPreview();
  }

  function onTextUpdated(slug: string, text: TextState | null) {
    setTexts((prev) => {
      const next = { ...prev };
      if (text) next[slug] = text;
      else delete next[slug];
      return next;
    });
    refreshPreview();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diseño del sitio</h1>
          <p className="text-sm text-gray-500 mt-1">
            Reemplaza fotos, vídeos y textos de la web pública. Los cambios son inmediatos.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_480px]">
        {/* Editor */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 gap-2">
            {[
              { id: "media", label: "Multimedia", icon: ImageIcon },
              { id: "text", label: "Textos", icon: Type },
              { id: "brand", label: "Marca", icon: Tag },
            ].map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id as typeof tab)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    active ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {tab === "media" && (
            <div className="space-y-3">
              {mediaSlots.map((slot) => (
                <AssetSlotRow
                  key={slot.slug}
                  slot={slot}
                  current={assets[slot.slug] ?? null}
                  onUpdated={(a) => onAssetUpdated(slot.slug, a)}
                />
              ))}
            </div>
          )}

          {tab === "text" && (
            <div className="space-y-3">
              {textOnlySlots.map((slot) => (
                <TextSlotRow
                  key={slot.slug}
                  slot={slot}
                  current={texts[slot.slug] ?? null}
                  onUpdated={(t) => onTextUpdated(slot.slug, t)}
                />
              ))}
            </div>
          )}

          {tab === "brand" && (
            <div className="space-y-3">
              {brandAssetSlots.map((slot) => (
                <AssetSlotRow
                  key={slot.slug}
                  slot={slot}
                  current={assets[slot.slug] ?? null}
                  onUpdated={(a) => onAssetUpdated(slot.slug, a)}
                />
              ))}
              {brandTextSlots.map((slot) => (
                <TextSlotRow
                  key={slot.slug}
                  slot={slot}
                  current={texts[slot.slug] ?? null}
                  onUpdated={(t) => onTextUpdated(slot.slug, t)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Vista previa</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPreviewTarget("/")}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  previewTarget === "/" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => setPreviewTarget("/catalog")}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  previewTarget === "/catalog" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Catálogo
              </button>
              <button
                type="button"
                onClick={refreshPreview}
                className="p-1 rounded text-gray-500 hover:text-gray-700"
                aria-label="Recargar"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="sticky top-4 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden" style={{ height: 600 }}>
            <iframe
              key={previewKey}
              src={previewTarget}
              className="w-full h-full border-0"
              title="Preview"
            />
          </div>
          <p className="text-xs text-gray-400">
            La vista previa carga la web pública real. Si no ves los cambios, pulsa <RefreshCw className="inline h-3 w-3" /> arriba.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------- Asset row ----------------

function AssetSlotRow({
  slot,
  current,
  onUpdated,
}: {
  slot: AssetSlot;
  current: AssetState | null;
  onUpdated: (a: AssetState | null) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (slot.accept === "image" && !file.type.startsWith("image/")) {
      showToast("Este slot solo acepta imágenes", "error");
      return;
    }
    if (slot.accept === "video" && !file.type.startsWith("video/")) {
      showToast("Este slot solo acepta vídeos", "error");
      return;
    }

    setBusy(true);
    setProgress(0);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
      const safeName = `${Date.now()}.${ext}`;
      const pathname = `site/${slot.slug}/${safeName}`;

      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({ siteSlug: slot.slug }),
        multipart: true,
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      });

      const type = file.type.startsWith("video/") ? "video" : "image";

      const res = await fetch(`/api/site-assets/${encodeURIComponent(slot.slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: blob.url, pathname: blob.pathname, type }),
      });
      const text = await res.text();
      let data: { asset?: AssetState; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Respuesta inesperada (${res.status})`);
      }
      if (!res.ok || !data.asset) throw new Error(data.error || `Error ${res.status}`);
      onUpdated(data.asset);
      showToast("Asset actualizado", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error al subir", "error");
    } finally {
      setBusy(false);
      setProgress(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function reset() {
    if (!confirm(`¿Volver al diseño original de "${slot.label}"?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/site-assets/${encodeURIComponent(slot.slug)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al borrar");
      onUpdated(null);
      showToast("Restaurado al original", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error", "error");
    } finally {
      setBusy(false);
    }
  }

  const acceptAttr =
    slot.accept === "image" ? "image/*" : slot.accept === "video" ? "video/*" : "image/*,video/*";

  const isVideo = current?.type === "video";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 flex gap-4">
      {/* Preview */}
      <div
        className={`flex-shrink-0 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center ${
          slot.preview === "tall" ? "w-24 h-32" : slot.preview === "square" ? "w-24 h-24" : "w-32 h-20"
        }`}
      >
        {current ? (
          isVideo ? (
            <video src={current.url} className="h-full w-full object-cover" muted />
          ) : (
            <img src={current.url} alt={slot.label} className="h-full w-full object-cover" />
          )
        ) : (
          <ImageIcon className="h-6 w-6 text-gray-300" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{slot.label}</p>
            {slot.description && <p className="text-xs text-gray-500 mt-0.5">{slot.description}</p>}
            <p className="text-xs text-gray-400 mt-1">
              Acepta:{" "}
              {slot.accept === "image" ? "imagen" : slot.accept === "video" ? "vídeo" : "imagen o vídeo"}
              {current ? ` · subido ${new Date(current.updatedAt).toLocaleString("es-ES")}` : " · sin personalizar"}
            </p>
          </div>
        </div>

        {busy && progress > 0 && (
          <div className="mt-2 h-1.5 bg-blue-100 rounded overflow-hidden">
            <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" disabled={busy} onClick={() => fileRef.current?.click()}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {busy ? `Subiendo ${Math.round(progress)}%` : current ? "Reemplazar" : "Subir"}
          </Button>
          {current && (
            <Button size="sm" variant="outline" disabled={busy} onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Volver al original
            </Button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept={acceptAttr}
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------- Text row ----------------

function TextSlotRow({
  slot,
  current,
  onUpdated,
}: {
  slot: TextSlot;
  current: TextState | null;
  onUpdated: (t: TextState | null) => void;
}) {
  const [value, setValue] = useState(current?.value ?? slot.default);
  const [saving, setSaving] = useState(false);
  const dirty = value !== (current?.value ?? slot.default);
  const isOverride = !!current;

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/site-texts/${encodeURIComponent(slot.slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      const text = await res.text();
      let data: { text?: TextState; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(`Respuesta inesperada (${res.status})`);
      }
      if (!res.ok || !data.text) throw new Error(data.error || `Error ${res.status}`);
      onUpdated(data.text);
      showToast("Texto guardado", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!confirm(`¿Volver al texto original de "${slot.label}"?`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/site-texts/${encodeURIComponent(slot.slug)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al borrar");
      onUpdated(null);
      setValue(slot.default);
      showToast("Restaurado al original", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {slot.label}
            {isOverride && (
              <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                personalizado
              </span>
            )}
          </p>
          {slot.description && <p className="text-xs text-gray-500 mt-0.5">{slot.description}</p>}
        </div>
      </div>

      {slot.multiline ? (
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-[80px] font-mono text-xs"
        />
      ) : (
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
      )}

      <div className="mt-3 flex items-center gap-2">
        <Button size="sm" loading={saving} disabled={!dirty || saving} onClick={save}>
          <Save className="h-4 w-4" />
          Guardar
        </Button>
        {isOverride && (
          <Button size="sm" variant="outline" disabled={saving} onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Volver al original
          </Button>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { showToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";
import { Globe, Plus, RefreshCw, Trash2, ToggleLeft, ToggleRight, CheckCircle, AlertCircle } from "lucide-react";

interface ApiItem {
  id: string;
  name: string;
  url: string;
  apiKey: string | null;
  isActive: boolean;
  lastSync: string | null;
  createdAt: string;
  _count: { cars: number };
}

interface FetchedCar {
  id?: string;
  title?: string;
  brand?: string;
  model?: string;
  price?: number;
  year?: number;
  [key: string]: unknown;
}

export default function AdminApisPage() {
  const [apis, setApis] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [fetchingId, setFetchingId] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<{ apiId: string; cars: FetchedCar[] } | null>(null);
  const [form, setForm] = useState({ name: "", url: "", apiKey: "", headers: "" });
  const [formLoading, setFormLoading] = useState(false);

  const fetchApis = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/apis");
      const data = await res.json();
      setApis(data);
    } catch {
      showToast("Error al cargar APIs", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchApis(); }, [fetchApis]);

  async function createApi() {
    setFormLoading(true);
    try {
      const res = await fetch("/api/apis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast("API añadida correctamente", "success");
      setShowAdd(false);
      setForm({ name: "", url: "", apiKey: "", headers: "" });
      fetchApis();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error al añadir", "error");
    } finally {
      setFormLoading(false);
    }
  }

  async function fetchFromApi(id: string) {
    setFetchingId(id);
    try {
      const res = await fetch(`/api/apis/${id}/fetch`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Normalize response - try to find an array of cars
      let cars: FetchedCar[] = [];
      if (Array.isArray(data.data)) cars = data.data;
      else if (Array.isArray(data.data?.results)) cars = data.data.results;
      else if (Array.isArray(data.data?.data)) cars = data.data.data;
      else if (Array.isArray(data.data?.items)) cars = data.data.items;
      else cars = [data.data]; // single item

      setFetchedData({ apiId: id, cars: cars.slice(0, 50) });
      showToast(`${cars.length} registros obtenidos`, "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error al conectar", "error");
    } finally {
      setFetchingId(null);
    }
  }

  async function toggleApi(id: string, isActive: boolean) {
    try {
      await fetch(`/api/apis/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      fetchApis();
    } catch {
      showToast("Error al actualizar", "error");
    }
  }

  async function deleteApi(id: string, name: string) {
    if (!confirm(`¿Eliminar la API "${name}"?`)) return;
    try {
      await fetch(`/api/apis/${id}`, { method: "DELETE" });
      showToast("API eliminada", "success");
      fetchApis();
    } catch {
      showToast("Error al eliminar", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">APIs Externas</h1>
          <p className="text-sm text-gray-500">Gestiona las fuentes externas de coches</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" />
          Añadir API
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : apis.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Globe className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No hay APIs configuradas</p>
          <p className="text-sm text-gray-400 mt-1">Añade una API externa para importar coches automáticamente</p>
          <Button className="mt-4" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4" />
            Añadir primera API
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {apis.map((api) => (
            <div key={api.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${api.isActive ? "bg-green-50" : "bg-gray-50"}`}>
                    <Globe className={`h-5 w-5 ${api.isActive ? "text-green-600" : "text-gray-400"}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{api.name}</h3>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{api.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {api.isActive ? (
                    <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="h-3 w-3" /> Activa
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      <AlertCircle className="h-3 w-3" /> Inactiva
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <span>{api._count.cars} coches importados</span>
                {api.lastSync && <span>· Último sync: {formatDate(api.lastSync)}</span>}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => fetchFromApi(api.id)}
                  loading={fetchingId === api.id}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Ver Coches
                </Button>
                <button
                  onClick={() => toggleApi(api.id, !api.isActive)}
                  className="rounded-md p-2 hover:bg-gray-100 text-gray-500"
                  title={api.isActive ? "Desactivar" : "Activar"}
                >
                  {api.isActive ? <ToggleRight className="h-4 w-4 text-green-600" /> : <ToggleLeft className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => deleteApi(api.id, api.name)}
                  className="rounded-md p-2 hover:bg-red-50 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fetched Data Modal */}
      {fetchedData && (
        <Modal
          open={!!fetchedData}
          onClose={() => setFetchedData(null)}
          title={`Datos de la API (${fetchedData.cars.length} registros)`}
          size="xl"
        >
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Estos son los registros disponibles en la API. Próximamente podrás seleccionarlos para importarlos al catálogo.
            </p>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {fetchedData.cars.map((car, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-3 text-xs">
                  <pre className="whitespace-pre-wrap text-gray-600 overflow-x-auto">
                    {JSON.stringify(car, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full" onClick={() => setFetchedData(null)}>Cerrar</Button>
          </div>
        </Modal>
      )}

      {/* Add API Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Añadir API Externa">
        <div className="space-y-4">
          <Input
            label="Nombre de la API"
            placeholder="Ej: AutoScout24, Wallapop Coches..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="URL del endpoint"
            type="url"
            placeholder="https://api.ejemplo.com/cars"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
          <Input
            label="API Key (opcional)"
            type="password"
            placeholder="Bearer token o API key"
            value={form.apiKey}
            onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Headers adicionales (JSON, opcional)</label>
            <textarea
              value={form.headers}
              onChange={(e) => setForm({ ...form, headers: e.target.value })}
              placeholder='{"X-Custom-Header": "value"}'
              className="w-full h-20 rounded-md border border-gray-300 px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancelar</Button>
            <Button onClick={createApi} loading={formLoading}>Guardar API</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

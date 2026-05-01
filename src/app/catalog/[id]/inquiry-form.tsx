"use client";
import { useState, useEffect } from "react";
import { showToast } from "@/components/ui/toast";
import { MessageSquare, Send } from "lucide-react";

export function InquiryForm({ carId }: { carId: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setIsLoggedIn(!!d.user));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 10) {
      showToast("El mensaje debe tener al menos 10 caracteres", "error");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId, message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar");
      setSent(true);
      showToast("Consulta enviada correctamente", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error al enviar", "error");
    } finally {
      setSending(false);
    }
  }

  if (isLoggedIn === null) {
    return (
      <div className="h-24 rounded-lg bg-gray-50 animate-pulse" />
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <a href="/login" className="block">
          <button className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Consultar disponibilidad
          </button>
        </a>
        <p className="mt-3 text-center text-xs text-gray-400">
          Inicia sesión para contactar con nosotros
        </p>
      </>
    );
  }

  if (sent) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
        <MessageSquare className="mx-auto h-8 w-8 text-green-500 mb-2" />
        <p className="text-sm font-medium text-green-700">Consulta enviada</p>
        <p className="text-xs text-green-600 mt-1">Te contactaremos pronto</p>
        <a href="/client/inquiries" className="mt-3 inline-block text-xs text-green-700 underline">
          Ver mis consultas
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        <MessageSquare className="h-4 w-4" />
        Enviar consulta
      </label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="Escribe tu mensaje... (precio final, disponibilidad, forma de pago...)"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {sending ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {sending ? "Enviando..." : "Enviar consulta"}
      </button>
    </form>
  );
}

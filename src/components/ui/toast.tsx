"use client";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((toast: Toast) => void)[] = [];

export function showToast(message: string, type: ToastType = "success") {
  const toast: Toast = { id: Math.random().toString(36), message, type };
  toastListeners.forEach((l) => l(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium max-w-sm",
            toast.type === "success" && "bg-green-50 border border-green-200 text-green-800",
            toast.type === "error" && "bg-red-50 border border-red-200 text-red-800",
            toast.type === "warning" && "bg-yellow-50 border border-yellow-200 text-yellow-800"
          )}
        >
          {toast.type === "success" && <CheckCircle className="h-4 w-4 flex-shrink-0" />}
          {toast.type === "error" && <XCircle className="h-4 w-4 flex-shrink-0" />}
          {toast.type === "warning" && <AlertCircle className="h-4 w-4 flex-shrink-0" />}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="flex-shrink-0 hover:opacity-70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

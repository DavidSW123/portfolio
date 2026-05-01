import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = "EUR"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
  }).format(price);
}

export function calculateFinalPrice(basePrice: number, markupPercent: number): number {
  return Math.round(basePrice * (1 + markupPercent / 100) * 100) / 100;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function sanitizeString(str: string): string {
  return str.replace(/[<>'"&]/g, (char) => {
    const map: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
      "&": "&amp;",
    };
    return map[char] || char;
  });
}

export const CAR_BRANDS = [
  "Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Toyota", "Honda", "Ford",
  "Chevrolet", "Hyundai", "Kia", "Mazda", "Nissan", "Porsche", "Tesla",
  "Volvo", "Jaguar", "Land Rover", "Lexus", "Infiniti", "Acura", "Subaru",
  "Mitsubishi", "Renault", "Peugeot", "Citroën", "Opel", "Seat", "Skoda",
  "Ferrari", "Lamborghini", "Maserati", "Alfa Romeo", "Fiat", "Jeep", "Dodge",
  "Chrysler", "Cadillac", "Lincoln", "Buick", "GMC", "Ram", "Mini", "Smart",
  "Otro",
];

export const FUEL_TYPES = ["Gasolina", "Diésel", "Híbrido", "Eléctrico", "GLP", "GNC", "Otro"];
export const TRANSMISSIONS = ["Manual", "Automático", "Semi-automático", "CVT"];
export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "Aprobado", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "Rechazado", color: "bg-red-100 text-red-800" },
  PUBLISHED: { label: "Publicado", color: "bg-blue-100 text-blue-800" },
};
export const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  ADMIN: { label: "Administrador", color: "bg-purple-100 text-purple-800" },
  PROVIDER: { label: "Proveedor", color: "bg-blue-100 text-blue-800" },
  COLLABORATOR: { label: "Colaborador", color: "bg-green-100 text-green-800" },
  CLIENT: { label: "Cliente", color: "bg-gray-100 text-gray-800" },
};

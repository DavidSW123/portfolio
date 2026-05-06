import { requireSession } from "@/lib/server-session";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CarForm } from "@/components/cars/car-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function ProviderAddCarPage() {
  const session = await requireSession(["PROVIDER", "ADMIN", "DEVELOPER"]);

  return (
    <DashboardLayout role="PROVIDER" userName={session.name} userEmail={session.email}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/provider" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ChevronLeft className="h-4 w-4" />
            Volver al panel
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Añadir Coche</h1>
          <p className="text-sm text-gray-500 mt-1">El coche quedará pendiente de aprobación por el administrador. El margen por defecto es del 30%.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <CarForm />
        </div>
      </div>
    </DashboardLayout>
  );
}

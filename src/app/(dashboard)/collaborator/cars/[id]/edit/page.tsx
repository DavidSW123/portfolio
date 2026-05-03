import { requireSession } from "@/lib/server-session";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditCarClient } from "@/components/cars/edit-car-client";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function CollaboratorEditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession(["COLLABORATOR", "ADMIN"]);
  const { id } = await params;

  const car = await prisma.car.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  if (!car) notFound();

  if (session.role !== "ADMIN" && car.submittedById !== session.id) {
    redirect("/unauthorized");
  }

  return (
    <DashboardLayout role="COLLABORATOR" userName={session.name} userEmail={session.email}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/collaborator/cars"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver a mis coches
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Editar Coche</h1>
          <p className="text-sm text-gray-500 mt-1">{car.title}</p>
        </div>
        <EditCarClient car={car} isAdmin={session.role === "ADMIN"} />
      </div>
    </DashboardLayout>
  );
}

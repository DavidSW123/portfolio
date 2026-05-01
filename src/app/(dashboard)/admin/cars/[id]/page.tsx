import { requireSession } from "@/lib/server-session";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminCarDetail } from "./car-detail-client";

export default async function AdminCarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession(["ADMIN"]);
  const { id } = await params;

  const car = await prisma.car.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { order: "asc" } },
      comments: { orderBy: { createdAt: "asc" } },
      submittedBy: { select: { id: true, name: true, email: true, role: true } },
      approvedBy: { select: { id: true, name: true } },
    },
  });

  if (!car) notFound();

  return (
    <DashboardLayout role="ADMIN" userName={session.name} userEmail={session.email}>
      <AdminCarDetail car={car as Parameters<typeof AdminCarDetail>[0]["car"]} />
    </DashboardLayout>
  );
}

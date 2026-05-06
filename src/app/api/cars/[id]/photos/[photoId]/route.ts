import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, createAuditLog } from "@/lib/auth";
import { del } from "@vercel/blob";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id, photoId } = await params;
  const photo = await prisma.carPhoto.findUnique({
    where: { id: photoId },
    include: { car: { select: { submittedById: true } } },
  });
  if (!photo || photo.carId !== id) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  if ((session.role !== "ADMIN" && session.role !== "DEVELOPER") && photo.car.submittedById !== session.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  // Best-effort delete on blob storage. Skip for external URLs (e.g. seed data).
  try {
    if (photo.url.includes(".blob.vercel-storage.com")) {
      await del(photo.url);
    }
  } catch {
    // non-critical
  }

  await prisma.carPhoto.delete({ where: { id: photoId } });
  await createAuditLog(session.id, "DELETE_PHOTO", "CarPhoto", photoId);

  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, createAuditLog } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const car = await prisma.car.findUnique({
    where: { id },
    select: { id: true, submittedById: true, photos: { select: { id: true } } },
  });
  if (!car) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  if (session.role !== "ADMIN" && car.submittedById !== session.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const photoFiles = formData.getAll("photos").filter((f): f is File => f instanceof File);
  if (photoFiles.length === 0) {
    return NextResponse.json({ error: "No se enviaron fotos" }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[cars/photos/POST] BLOB_READ_WRITE_TOKEN not configured");
    return NextResponse.json(
      { error: "El almacenamiento de fotos no está configurado en el servidor" },
      { status: 500 },
    );
  }

  const startOrder = car.photos.length;
  const photoData: { carId: string; url: string; filename: string; order: number }[] = [];

  try {
    for (let i = 0; i < photoFiles.length; i++) {
      const file = photoFiles[i];
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 10 * 1024 * 1024) continue;

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filename = `${Date.now()}-${i}.${ext}`;
      const blob = await put(`cars/${car.id}/${filename}`, file, {
        access: "public",
        addRandomSuffix: false,
      });

      photoData.push({
        carId: car.id,
        url: blob.url,
        filename,
        order: startOrder + i,
      });
    }
  } catch (err) {
    console.error("[cars/photos/POST] Blob upload failed", err);
    return NextResponse.json(
      { error: `Error al subir a Vercel Blob: ${err instanceof Error ? err.message : "error desconocido"}` },
      { status: 500 },
    );
  }

  if (photoData.length === 0) {
    return NextResponse.json({ error: "Las fotos no son válidas" }, { status: 400 });
  }

  await prisma.carPhoto.createMany({ data: photoData });
  await createAuditLog(session.id, "ADD_PHOTOS", "Car", car.id, `+${photoData.length} fotos`);

  const photos = await prisma.carPhoto.findMany({
    where: { carId: car.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ photos }, { status: 201 });
}

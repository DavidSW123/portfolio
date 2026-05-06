import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, createAuditLog } from "@/lib/auth";
import { z } from "zod";

const bodySchema = z.object({
  photos: z
    .array(
      z.object({
        url: z.string().url(),
        pathname: z.string().min(1),
      }),
    )
    .min(1)
    .max(20),
});

function isValidBlobUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const car = await prisma.car.findUnique({
    where: { id },
    select: { id: true, submittedById: true, photos: { select: { id: true } } },
  });
  if (!car) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  if ((session.role !== "ADMIN" && session.role !== "DEVELOPER") && car.submittedById !== session.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  for (const p of parsed.data.photos) {
    if (!isValidBlobUrl(p.url)) {
      return NextResponse.json({ error: "URL de foto inválida" }, { status: 400 });
    }
  }

  const startOrder = car.photos.length;
  const photoData = parsed.data.photos.map((p, i) => ({
    carId: car.id,
    url: p.url,
    filename: p.pathname.split("/").pop() || `photo-${i}`,
    order: startOrder + i,
  }));

  await prisma.carPhoto.createMany({ data: photoData });
  await createAuditLog(session.id, "ADD_PHOTOS", "Car", car.id, `+${photoData.length} fotos`);

  const photos = await prisma.carPhoto.findMany({
    where: { carId: car.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ photos }, { status: 201 });
}

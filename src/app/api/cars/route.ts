import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, createAuditLog } from "@/lib/auth";
import { calculateFinalPrice } from "@/lib/utils";
import { put } from "@vercel/blob";
import { z } from "zod";

const carSchema = z.object({
  title: z.string().min(3).max(200),
  brand: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 2),
  mileage: z.coerce.number().int().min(0).optional(),
  color: z.string().max(50).optional(),
  fuelType: z.string().max(50).optional(),
  transmission: z.string().max(50).optional(),
  engine: z.string().max(100).optional(),
  doors: z.coerce.number().int().min(1).max(10).optional(),
  description: z.string().max(5000).optional(),
  basePrice: z.coerce.number().positive(),
  markup: z.coerce.number().min(0).max(500).optional(),
  comment: z.string().max(2000).optional(),
});

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
  const skip = (page - 1) * limit;
  const status = searchParams.get("status");
  const brand = searchParams.get("brand");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};

  if (session.role === "ADMIN") {
    if (status) where.status = status;
  } else if (session.role === "PROVIDER" || session.role === "COLLABORATOR") {
    where.submittedById = session.id;
    if (status) where.status = status;
  } else {
    where.isPublished = true;
    where.status = "PUBLISHED";
  }

  if (brand) where.brand = brand;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { brand: { contains: search } },
      { model: { contains: search } },
    ];
  }

  const [cars, total] = await Promise.all([
    prisma.car.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        photos: { orderBy: { order: "asc" }, take: 1 },
        submittedBy: { select: { id: true, name: true, email: true, role: true } },
        _count: { select: { photos: true, comments: true } },
      },
    }),
    prisma.car.count({ where }),
  ]);

  return NextResponse.json({ cars, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  if (!["ADMIN", "PROVIDER", "COLLABORATOR"].includes(session.role)) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const raw: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") raw[key] = value;
  }

  const result = carSchema.safeParse(raw);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const data = result.data;
  const markup = session.role === "ADMIN" ? (data.markup ?? 30) : 30;
  const finalPrice = calculateFinalPrice(data.basePrice, markup);

  const isAdmin = session.role === "ADMIN";

  const car = await prisma.car.create({
    data: {
      title: data.title,
      brand: data.brand,
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      color: data.color,
      fuelType: data.fuelType,
      transmission: data.transmission,
      engine: data.engine,
      doors: data.doors,
      description: data.description,
      basePrice: data.basePrice,
      markup,
      finalPrice,
      status: isAdmin ? "APPROVED" : "PENDING",
      source: isAdmin ? "ADMIN" : "MANUAL",
      isPublished: false,
      submittedById: session.id,
      approvedById: isAdmin ? session.id : undefined,
      approvedAt: isAdmin ? new Date() : undefined,
      comments: data.comment
        ? {
            create: {
              content: data.comment,
              authorId: session.id,
              authorName: session.name,
              isInternal: true,
            },
          }
        : undefined,
    },
  });

  const photoFiles = formData.getAll("photos").filter((f): f is File => f instanceof File);
  if (photoFiles.length > 0) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("[cars/POST] BLOB_READ_WRITE_TOKEN not configured");
      return NextResponse.json(
        { id: car.id, status: car.status, warning: "Coche creado, pero el almacenamiento de fotos no está configurado en el servidor." },
        { status: 201 },
      );
    }

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
          order: i,
        });
      }
    } catch (err) {
      console.error("[cars/POST] Blob upload failed", err);
      return NextResponse.json(
        {
          id: car.id,
          status: car.status,
          warning: `Coche creado, pero falló la subida de fotos: ${err instanceof Error ? err.message : "error desconocido"}`,
        },
        { status: 201 },
      );
    }

    if (photoData.length > 0) {
      await prisma.carPhoto.createMany({ data: photoData });
    }
  }

  await createAuditLog(session.id, "CREATE_CAR", "Car", car.id, `Coche creado: ${car.title}`);

  return NextResponse.json({ id: car.id, status: car.status }, { status: 201 });
}

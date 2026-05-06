import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, createAuditLog } from "@/lib/auth";
import { calculateFinalPrice } from "@/lib/utils";
import { z } from "zod";

const photoRefSchema = z.object({
  url: z.string().url(),
  pathname: z.string().min(1),
});

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
  photos: z.array(photoRefSchema).max(20).optional(),
});

function isValidBlobUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

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

  if ((session.role === "ADMIN" || session.role === "DEVELOPER")) {
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

  if (!["ADMIN", "DEVELOPER", "PROVIDER", "COLLABORATOR"].includes(session.role)) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const result = carSchema.safeParse(raw);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const data = result.data;

  if (data.photos) {
    for (const p of data.photos) {
      if (!isValidBlobUrl(p.url)) {
        return NextResponse.json({ error: "URL de foto inválida" }, { status: 400 });
      }
    }
  }

  const markup = (session.role === "ADMIN" || session.role === "DEVELOPER") ? (data.markup ?? 30) : 30;
  const finalPrice = calculateFinalPrice(data.basePrice, markup);
  const isAdmin = (session.role === "ADMIN" || session.role === "DEVELOPER");

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
      photos: data.photos && data.photos.length > 0
        ? {
            createMany: {
              data: data.photos.map((p, i) => ({
                url: p.url,
                filename: p.pathname.split("/").pop() || `photo-${i}`,
                order: i,
              })),
            },
          }
        : undefined,
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

  await createAuditLog(session.id, "CREATE_CAR", "Car", car.id, `Coche creado: ${car.title}`);

  return NextResponse.json({ id: car.id, status: car.status }, { status: 201 });
}

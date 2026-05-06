import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  carId: z.string().min(1),
  message: z.string().min(10, "Mínimo 10 caracteres").max(1000),
});

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = 20;
  const skip = (page - 1) * limit;

  const where =
    (session.role === "ADMIN" || session.role === "DEVELOPER")
      ? {}
      : { client: { userId: session.id } };

  const [inquiries, total] = await Promise.all([
    prisma.carInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        car: { select: { id: true, title: true, finalPrice: true, photos: { take: 1 } } },
        client: { select: { id: true, user: { select: { name: true, email: true } } } },
      },
    }),
    prisma.carInquiry.count({ where }),
  ]);

  return NextResponse.json({ inquiries, total });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Datos inválidos" }, { status: 400 });
  }

  // Ensure client record exists for this user
  let client = await prisma.client.findUnique({ where: { userId: session.id } });
  if (!client) {
    client = await prisma.client.create({ data: { userId: session.id } });
  }

  const car = await prisma.car.findUnique({
    where: { id: parsed.data.carId, isPublished: true },
  });
  if (!car) {
    return NextResponse.json({ error: "Coche no encontrado" }, { status: 404 });
  }

  const inquiry = await prisma.carInquiry.create({
    data: {
      carId: parsed.data.carId,
      clientId: client.id,
      message: parsed.data.message,
    },
    include: {
      car: { select: { id: true, title: true } },
    },
  });

  return NextResponse.json(inquiry, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, createAuditLog } from "@/lib/auth";
import { calculateFinalPrice } from "@/lib/utils";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
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

  if (!car) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  // Access control
  if (!session) {
    if (!car.isPublished) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    return NextResponse.json(car);
  }

  if (
    (session.role !== "ADMIN" && session.role !== "DEVELOPER") &&
    !car.isPublished &&
    car.submittedById !== session.id
  ) {
    return NextResponse.json({ error: "Sin acceso" }, { status: 403 });
  }

  // Filter internal comments for non-admins
  if ((session.role !== "ADMIN" && session.role !== "DEVELOPER")) {
    car.comments = car.comments.filter((c) => !c.isInternal);
  }

  return NextResponse.json(car);
}

const updateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  year: z.coerce.number().int().min(1900).optional(),
  mileage: z.coerce.number().int().min(0).optional(),
  color: z.string().max(50).optional(),
  fuelType: z.string().max(50).optional(),
  transmission: z.string().max(50).optional(),
  engine: z.string().max(100).optional(),
  doors: z.coerce.number().int().optional(),
  description: z.string().max(5000).optional(),
  basePrice: z.coerce.number().positive().optional(),
  markup: z.coerce.number().min(0).max(500).optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "PUBLISHED"]).optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  // Only admin or owner can edit
  if ((session.role !== "ADMIN" && session.role !== "DEVELOPER") && car.submittedById !== session.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  // Non-admins cannot change status or markup
  const body = await req.json();
  if ((session.role !== "ADMIN" && session.role !== "DEVELOPER")) {
    delete body.status;
    delete body.markup;
    delete body.isPublished;
  }

  const result = updateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const updates = result.data;
  let finalPrice = car.finalPrice;
  if (updates.basePrice !== undefined || updates.markup !== undefined) {
    finalPrice = calculateFinalPrice(
      updates.basePrice ?? car.basePrice,
      updates.markup ?? car.markup
    );
  }

  // If admin is approving
  const approvalData: Record<string, unknown> = {};
  if ((session.role === "ADMIN" || session.role === "DEVELOPER") && updates.status === "APPROVED") {
    approvalData.approvedById = session.id;
    approvalData.approvedAt = new Date();
  }

  const updated = await prisma.car.update({
    where: { id },
    data: { ...updates, finalPrice, ...approvalData },
  });

  await createAuditLog(session.id, "UPDATE_CAR", "Car", id, `Estado: ${updated.status}`);

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if ((session.role !== "ADMIN" && session.role !== "DEVELOPER")) return NextResponse.json({ error: "Sin permisos" }, { status: 403 });

  const { id } = await params;
  await prisma.car.delete({ where: { id } });
  await createAuditLog(session.id, "DELETE_CAR", "Car", id);

  return NextResponse.json({ success: true });
}

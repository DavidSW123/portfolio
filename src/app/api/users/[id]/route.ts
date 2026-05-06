import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, createAuditLog } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.enum(["ADMIN", "DEVELOPER", "PROVIDER", "COLLABORATOR", "CLIENT"]).optional(),
  isActive: z.boolean().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  dni: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;

  if ((session.role !== "ADMIN" && session.role !== "DEVELOPER") && session.id !== id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      image: true,
      createdAt: true,
      client: true,
      _count: { select: { cars: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;

  const isAdmin = (session.role === "ADMIN" || session.role === "DEVELOPER");
  const isSelf = session.id === id;

  if (!isAdmin && !isSelf) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const body = await req.json();

  // Non-admins cannot change role or isActive
  if (!isAdmin) {
    delete body.role;
    delete body.isActive;
  }

  const result = updateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const { name, role, isActive, phone, address, city, country, dni, notes } = result.data;

  const userUpdate: Record<string, unknown> = {};
  if (name !== undefined) userUpdate.name = name;
  if (role !== undefined) userUpdate.role = role;
  if (isActive !== undefined) userUpdate.isActive = isActive;

  const clientUpdate: Record<string, unknown> = {};
  if (phone !== undefined) clientUpdate.phone = phone;
  if (address !== undefined) clientUpdate.address = address;
  if (city !== undefined) clientUpdate.city = city;
  if (country !== undefined) clientUpdate.country = country;
  if (dni !== undefined) clientUpdate.dni = dni;
  if (notes !== undefined) clientUpdate.notes = notes;

  await prisma.user.update({
    where: { id },
    data: {
      ...userUpdate,
      client: Object.keys(clientUpdate).length
        ? { upsert: { create: clientUpdate, update: clientUpdate } }
        : undefined,
    },
  });

  if (isAdmin) {
    await createAuditLog(session.id, "UPDATE_USER", "User", id, JSON.stringify(userUpdate));
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "DEVELOPER")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.id) {
    return NextResponse.json({ error: "No puedes eliminarte a ti mismo" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  await createAuditLog(session.id, "DELETE_USER", "User", id);

  return NextResponse.json({ success: true });
}

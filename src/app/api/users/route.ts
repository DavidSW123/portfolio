import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, hashPassword, createAuditLog } from "@/lib/auth";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "DEVELOPER")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = 20;

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: { select: { cars: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, pages: Math.ceil(total / limit) });
}

const createSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "DEVELOPER", "PROVIDER", "COLLABORATOR", "CLIENT"]),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "DEVELOPER")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const body = await req.json();
  const result = createSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const { name, email, password, role, phone } = result.data;

  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (exists) return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
      client: role === "CLIENT" ? { create: { phone: phone || null } } : undefined,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  await createAuditLog(session.id, "CREATE_USER", "User", user.id, `Creado con rol ${role}`);

  return NextResponse.json(user, { status: 201 });
}

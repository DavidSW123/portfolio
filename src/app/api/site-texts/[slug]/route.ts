import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, createAuditLog } from "@/lib/auth";
import { findTextSlot } from "@/lib/design-slots";
import { z } from "zod";

const putSchema = z.object({
  value: z.string().max(5000),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (session.role !== "DEVELOPER") {
    return NextResponse.json({ error: "Solo DEVELOPER puede editar el diseño" }, { status: 403 });
  }

  const { slug } = await params;
  if (!findTextSlot(slug)) {
    return NextResponse.json({ error: "Slot desconocido" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const row = await prisma.siteText.upsert({
    where: { slug },
    create: { slug, value: parsed.data.value, updatedById: session.id },
    update: { value: parsed.data.value, updatedById: session.id },
  });

  await createAuditLog(session.id, "UPDATE_SITE_TEXT", "SiteText", row.id, slug);

  return NextResponse.json({ text: row });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (session.role !== "DEVELOPER") {
    return NextResponse.json({ error: "Solo DEVELOPER puede editar el diseño" }, { status: 403 });
  }

  const { slug } = await params;
  await prisma.siteText.deleteMany({ where: { slug } });
  await createAuditLog(session.id, "DELETE_SITE_TEXT", "SiteText", slug, slug);

  return NextResponse.json({ success: true });
}

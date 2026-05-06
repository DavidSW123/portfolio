import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, createAuditLog } from "@/lib/auth";
import { findAssetSlot } from "@/lib/design-slots";
import { z } from "zod";

const putSchema = z.object({
  url: z.string().url(),
  pathname: z.string().min(1),
  type: z.enum(["image", "video"]),
});

function isValidBlobUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (session.role !== "DEVELOPER") {
    return NextResponse.json({ error: "Solo DEVELOPER puede editar el diseño" }, { status: 403 });
  }

  const { slug } = await params;
  const slot = findAssetSlot(slug);
  if (!slot) return NextResponse.json({ error: "Slot desconocido" }, { status: 404 });

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
  const { url, pathname, type } = parsed.data;

  if (!isValidBlobUrl(url)) {
    return NextResponse.json({ error: "URL fuera del blob store" }, { status: 400 });
  }

  if (slot.accept !== "image|video" && slot.accept !== type) {
    return NextResponse.json(
      { error: `Este slot solo acepta ${slot.accept}` },
      { status: 400 },
    );
  }

  const row = await prisma.siteAsset.upsert({
    where: { slug },
    create: { slug, type, url, pathname, updatedById: session.id },
    update: { type, url, pathname, updatedById: session.id },
  });

  await createAuditLog(session.id, "UPDATE_SITE_ASSET", "SiteAsset", row.id, slug);

  return NextResponse.json({ asset: row });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  if (session.role !== "DEVELOPER") {
    return NextResponse.json({ error: "Solo DEVELOPER puede editar el diseño" }, { status: 403 });
  }

  const { slug } = await params;
  await prisma.siteAsset.deleteMany({ where: { slug } });
  await createAuditLog(session.id, "DELETE_SITE_ASSET", "SiteAsset", slug, slug);

  return NextResponse.json({ success: true });
}

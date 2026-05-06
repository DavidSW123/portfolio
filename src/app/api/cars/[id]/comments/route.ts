import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, createAuditLog } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  content: z.string().min(1).max(2000),
  isInternal: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  // Only admin can add internal comments
  const isInternal = (session.role === "ADMIN" || session.role === "DEVELOPER") ? result.data.isInternal : false;

  const comment = await prisma.carComment.create({
    data: {
      carId: id,
      authorId: session.id,
      authorName: session.name,
      content: result.data.content,
      isInternal,
    },
  });

  await createAuditLog(
    session.id,
    "ADD_COMMENT",
    "Car",
    id,
    isInternal ? "Comentario interno" : "Comentario público",
  );

  return NextResponse.json(comment, { status: 201 });
}

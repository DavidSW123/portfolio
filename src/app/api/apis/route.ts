import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, createAuditLog } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url("URL inválida").max(500),
  apiKey: z.string().max(500).optional(),
  headers: z.string().max(2000).optional(),
});

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "DEVELOPER")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const apis = await prisma.apiConfig.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { cars: true } } },
  });

  // Mask API keys in response
  return NextResponse.json(
    apis.map((api) => ({ ...api, apiKey: api.apiKey ? "****" : null }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "DEVELOPER")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const body = await req.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
  }

  const api = await prisma.apiConfig.create({ data: result.data });
  await createAuditLog(session.id, "CREATE_API", "ApiConfig", api.id, api.name);

  return NextResponse.json({ ...api, apiKey: api.apiKey ? "****" : null }, { status: 201 });
}

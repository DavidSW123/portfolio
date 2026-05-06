import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "DEVELOPER")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const { id } = await params;
  const apiConfig = await prisma.apiConfig.findUnique({ where: { id } });
  if (!apiConfig) return NextResponse.json({ error: "API no encontrada" }, { status: 404 });

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiConfig.apiKey) headers["Authorization"] = `Bearer ${apiConfig.apiKey}`;
    if (apiConfig.headers) {
      try {
        const extra = JSON.parse(apiConfig.headers);
        Object.assign(headers, extra);
      } catch {
        // ignore malformed headers
      }
    }

    const res = await fetch(apiConfig.url, { headers, signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`API respondió con ${res.status}`);

    const data = await res.json();

    await prisma.apiConfig.update({ where: { id }, data: { lastSync: new Date() } });

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al conectar con la API" },
      { status: 502 }
    );
  }
}

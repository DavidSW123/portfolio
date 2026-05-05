import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_SIZE_BYTES = 25 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  if (!["ADMIN", "PROVIDER", "COLLABORATOR"].includes(session.role)) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[blob/upload] BLOB_READ_WRITE_TOKEN not configured");
    return NextResponse.json(
      { error: "El almacenamiento de fotos no está configurado en el servidor" },
      { status: 500 },
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let payload: { carId?: string; uploadId?: string };
        try {
          payload = clientPayload ? JSON.parse(clientPayload) : {};
        } catch {
          throw new Error("clientPayload con formato inválido");
        }

        if (payload.carId) {
          const car = await prisma.car.findUnique({
            where: { id: payload.carId },
            select: { id: true, submittedById: true },
          });
          if (!car) throw new Error("Coche no encontrado");
          if (session.role !== "ADMIN" && car.submittedById !== session.id) {
            throw new Error("Sin permisos sobre este coche");
          }
          if (!pathname.startsWith(`cars/${payload.carId}/`)) {
            throw new Error("Pathname fuera del scope permitido");
          }
        } else if (payload.uploadId) {
          if (!/^[A-Za-z0-9_-]{8,64}$/.test(payload.uploadId)) {
            throw new Error("uploadId con formato inválido");
          }
          if (!pathname.startsWith(`cars/uploads/${payload.uploadId}/`)) {
            throw new Error("Pathname fuera del scope permitido");
          }
        } else {
          throw new Error("clientPayload debe incluir carId o uploadId");
        }

        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_SIZE_BYTES,
          addRandomSuffix: true,
          tokenPayload: clientPayload,
        };
      },
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[blob/upload] handleUpload failed", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error generando token de subida" },
      { status: 400 },
    );
  }
}

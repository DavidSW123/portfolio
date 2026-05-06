import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findAssetSlot } from "@/lib/design-slots";

const MAX_SIZE_BYTES = 100 * 1024 * 1024; // up to 100MB for site videos
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }
  if (!["ADMIN", "DEVELOPER", "PROVIDER", "COLLABORATOR"].includes(session.role)) {
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
        let payload: { carId?: string; uploadId?: string; siteSlug?: string };
        try {
          payload = clientPayload ? JSON.parse(clientPayload) : {};
        } catch {
          throw new Error("clientPayload con formato inválido");
        }

        // Site design uploads — DEVELOPER only, scoped to /site/<slug>/
        if (payload.siteSlug) {
          if (session.role !== "DEVELOPER") {
            throw new Error("Solo DEVELOPER puede subir activos del sitio");
          }
          const slot = findAssetSlot(payload.siteSlug);
          if (!slot) throw new Error("Slot desconocido");
          if (!pathname.startsWith(`site/${payload.siteSlug}/`)) {
            throw new Error("Pathname fuera del scope permitido");
          }
          const allowed: string[] = [];
          if (slot.accept === "image" || slot.accept === "image|video") allowed.push(...ALLOWED_IMAGE_TYPES);
          if (slot.accept === "video" || slot.accept === "image|video") allowed.push(...ALLOWED_VIDEO_TYPES);
          return {
            allowedContentTypes: allowed,
            maximumSizeInBytes: MAX_SIZE_BYTES,
            addRandomSuffix: true,
            tokenPayload: clientPayload,
          };
        }

        if (payload.carId) {
          const car = await prisma.car.findUnique({
            where: { id: payload.carId },
            select: { id: true, submittedById: true },
          });
          if (!car) throw new Error("Coche no encontrado");
          if ((session.role !== "ADMIN" && session.role !== "DEVELOPER") && car.submittedById !== session.id) {
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
          throw new Error("clientPayload debe incluir carId, uploadId o siteSlug");
        }

        return {
          allowedContentTypes: ALLOWED_PHOTO_TYPES,
          maximumSizeInBytes: 25 * 1024 * 1024,
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

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ASSET_SLOTS } from "@/lib/design-slots";

export async function GET(_req: NextRequest) {
  const rows = await prisma.siteAsset.findMany({
    select: { slug: true, url: true, pathname: true, type: true, updatedAt: true },
  });
  const map: Record<string, { url: string; pathname: string; type: string; updatedAt: Date }> = {};
  for (const r of rows) map[r.slug] = r;
  return NextResponse.json({ assets: map, slots: ASSET_SLOTS });
}

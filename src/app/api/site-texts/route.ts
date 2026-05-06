import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TEXT_SLOTS } from "@/lib/design-slots";

export async function GET(_req: NextRequest) {
  const rows = await prisma.siteText.findMany({
    select: { slug: true, value: true, updatedAt: true },
  });
  const overrides: Record<string, { value: string; updatedAt: Date }> = {};
  for (const r of rows) overrides[r.slug] = r;
  return NextResponse.json({ overrides, slots: TEXT_SLOTS });
}

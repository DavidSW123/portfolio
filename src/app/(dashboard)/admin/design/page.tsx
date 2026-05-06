import { requireSession } from "@/lib/server-session";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { prisma } from "@/lib/prisma";
import { ASSET_SLOTS, TEXT_SLOTS } from "@/lib/design-slots";
import { DesignClient } from "./design-client";

export default async function DesignPage() {
  const session = await requireSession(["DEVELOPER"]);

  const [assetRows, textRows] = await Promise.all([
    prisma.siteAsset.findMany({
      select: { slug: true, url: true, pathname: true, type: true, updatedAt: true },
    }),
    prisma.siteText.findMany({
      select: { slug: true, value: true, updatedAt: true },
    }),
  ]);

  const initialAssets: Record<string, { url: string; pathname: string; type: string; updatedAt: string }> = {};
  for (const a of assetRows) {
    initialAssets[a.slug] = { url: a.url, pathname: a.pathname, type: a.type, updatedAt: a.updatedAt.toISOString() };
  }
  const initialTexts: Record<string, { value: string; updatedAt: string }> = {};
  for (const t of textRows) {
    initialTexts[t.slug] = { value: t.value, updatedAt: t.updatedAt.toISOString() };
  }

  return (
    <DashboardLayout role={session.role} userName={session.name} userEmail={session.email}>
      <DesignClient
        slotsAssets={ASSET_SLOTS}
        slotsTexts={TEXT_SLOTS}
        initialAssets={initialAssets}
        initialTexts={initialTexts}
      />
    </DashboardLayout>
  );
}

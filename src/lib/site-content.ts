// Server helper: fetch all editable site content (assets + texts) in a single
// pass and return a {asset, text} pair of slug -> value maps. Used by every
// public page to render the customized content with fallbacks.

import { prisma } from "@/lib/prisma";
import { TEXT_SLOTS } from "@/lib/design-slots";

export interface SiteAssetEntry {
  url: string;
  pathname: string;
  type: string;
}

export interface SiteContent {
  assets: Record<string, SiteAssetEntry>;
  texts: Record<string, string>;
}

export async function loadSiteContent(): Promise<SiteContent> {
  const [assetRows, textRows] = await Promise.all([
    prisma.siteAsset.findMany({ select: { slug: true, url: true, pathname: true, type: true } }),
    prisma.siteText.findMany({ select: { slug: true, value: true } }),
  ]);

  const assets: Record<string, SiteAssetEntry> = {};
  for (const a of assetRows) {
    assets[a.slug] = { url: a.url, pathname: a.pathname, type: a.type };
  }

  const texts: Record<string, string> = {};
  for (const slot of TEXT_SLOTS) texts[slot.slug] = slot.default;
  for (const t of textRows) texts[t.slug] = t.value;

  return { assets, texts };
}

export function textOr(content: SiteContent, slug: string, fallback: string): string {
  return content.texts[slug] ?? fallback;
}

export function assetOr(content: SiteContent, slug: string): SiteAssetEntry | null {
  return content.assets[slug] ?? null;
}

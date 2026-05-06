import { loadSiteContent } from "@/lib/site-content";
import { HomeClient } from "./home-client";

export default async function HomePage() {
  const content = await loadSiteContent();
  return <HomeClient content={content} />;
}

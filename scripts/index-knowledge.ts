import { Index } from "@upstash/vector";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://alton-portfolio-api.onrender.com";

interface ContentItem {
  id: number;
  title: string;
  intro?: string;
  meta: {
    slug: string;
    type: string;
  };
}

async function indexContentType(endpoint: string, itemType: string) {
  try {
    console.log("Fetching " + itemType + "s from Wagtail...");
    const res = await fetch(API_BASE + "/api/v2/pages/?type=" + endpoint + "&fields=*");
    
    if (!res.ok) {
      console.error("Failed to fetch " + itemType + "s: " + res.statusText);
      return;
    }

    const data = await res.json();
    const items: ContentItem[] = data.items || [];

    for (const item of items) {
      const vectorId = itemType + "-" + item.id;
      const textToEmbed = item.title + ". " + (item.intro || "");
      
      console.log("Indexing " + itemType + ": \"" + item.title + "\"");

      await index.upsert({
        id: vectorId,
        data: textToEmbed,
        metadata: {
          title: item.title,
          slug: item.meta.slug,
          type: itemType,
          url: "/" + itemType + "s/" + item.meta.slug,
        },
      });
    }
  } catch (err) {
    console.error("Error indexing " + itemType + "s:", err);
  }
}

async function main() {
  console.log("Starting Vector Knowledge Base Indexing...\n");

  await indexContentType("home.ProjectPage", "project");
  await indexContentType("home.BlogPage", "blog");
  await indexContentType("home.LecturePage", "lecture");

  console.log("\nFinished indexing all content into Upstash Vector!");
}

main().catch(console.error);
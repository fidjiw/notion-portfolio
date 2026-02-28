import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  timeoutMs: 10000, // 10 second timeout
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export interface Project {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  githubUrl: string | null;
  liveUrl: string | null;
  order: number;
}

let cache: { data: Project[]; timestamp: number } | null = null;
const CACHE_TTL = 60 * 1000; // 60 seconds

export async function getProjects(): Promise<Project[]> {
  const now = Date.now();
  if (cache && now - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
      sorts: [{ property: "Order", direction: "ascending" }],
    });

    const projects: Project[] = response.results
      .map((page: any) => {
        const props = page.properties;
        return {
          id: page.id,
          name: props.Name?.title?.[0]?.plain_text ?? "",
          icon: props.Icon?.rich_text?.[0]?.plain_text ?? "📦",
          category: props.Category?.select?.name ?? "",
          description: props.Description?.rich_text?.[0]?.plain_text ?? "",
          githubUrl: props["GitHub URL"]?.url ?? null,
          liveUrl: props["Live URL"]?.url ?? null,
          order: props.Order?.number ?? 999,
        };
      })
      .filter((p) => p.name);

    cache = { data: projects, timestamp: now };
    return projects;
  } catch (error) {
    console.error("Failed to fetch from Notion:", error);
    // Return cached data if available, even if expired
    if (cache) {
      console.log("Returning stale cache due to error");
      return cache.data;
    }
    return [];
  }
}

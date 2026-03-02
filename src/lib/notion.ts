import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  timeoutMs: 10000,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export interface Tag {
  name: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  githubUrl: string | null;
  liveUrl: string | null;
  order: number;
  tags: Tag[];
  status: string;
}

let projectsCache: { data: Project[]; timestamp: number } | null = null;
const PROJECTS_CACHE_TTL = 60 * 1000;

const blocksCache: Map<string, { data: any[]; timestamp: number }> = new Map();
const BLOCKS_CACHE_TTL = 5 * 60 * 1000;

export async function getProjects(): Promise<Project[]> {
  const now = Date.now();
  if (projectsCache && now - projectsCache.timestamp < PROJECTS_CACHE_TTL) {
    return projectsCache.data;
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
          icon: props.Icon?.rich_text?.[0]?.plain_text ?? "\ud83d\udce6",
          category: props.Category?.select?.name ?? "",
          description: props.Description?.rich_text?.[0]?.plain_text ?? "",
          githubUrl: props["GitHub URL"]?.url ?? null,
          liveUrl: props["Live URL"]?.url ?? null,
          order: props.Order?.number ?? 999,
          tags: (props.Tags?.multi_select ?? []).map((t: any) => ({
            name: t.name,
            color: t.color ?? "default",
          })),
          status: props.Status?.status?.name ?? props.Status?.select?.name ?? "",
        };
      })
      .filter((p) => p.name);

    projectsCache = { data: projects, timestamp: now };
    return projects;
  } catch (error) {
    console.error("Failed to fetch from Notion:", error);
    if (projectsCache) {
      console.log("Returning stale cache due to error");
      return projectsCache.data;
    }
    return [];
  }
}

export async function getProjectBlocks(pageId: string): Promise<any[]> {
  const now = Date.now();
  const cached = blocksCache.get(pageId);
  if (cached && now - cached.timestamp < BLOCKS_CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    const blocks = await Promise.all(
      response.results.map(async (block: any) => {
        if (block.has_children && (block.type === "table" || block.type === "toggle")) {
          const children = await notion.blocks.children.list({
            block_id: block.id,
            page_size: 100,
          });
          return { ...block, children: children.results };
        }
        return block;
      })
    );

    blocksCache.set(pageId, { data: blocks, timestamp: now });
    return blocks;
  } catch (error) {
    console.error("Failed to fetch blocks for", pageId, ":", error);
    const stale = blocksCache.get(pageId);
    if (stale) return stale.data;
    return [];
  }
}

import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  timeoutMs: 10000,
});

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await context.params;
    
    // Fetch blocks from the Notion page
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    return NextResponse.json({ blocks: response.results });
  } catch (error) {
    console.error("Failed to fetch page content:", error);
    return NextResponse.json({ blocks: [] }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getProjectBlocks } from "@/lib/notion";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await context.params;
    const blocks = await getProjectBlocks(pageId);
    return NextResponse.json({ blocks });
  } catch (error) {
    console.error("Failed to fetch page content:", error);
    return NextResponse.json({ blocks: [] }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getProjects } from "@/lib/notion";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Force fresh data by clearing cache behavior
    const projects = await getProjects();
    return NextResponse.json({ projects, count: projects.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

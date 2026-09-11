import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { Project } from "@/models/Project";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();

    let project: Project | null = null;
    if (ObjectId.isValid(id)) {
      project = await db.collection<Project>("projects").findOne({ _id: new ObjectId(id) });
    }
    if (!project) {
      project = await db.collection<Project>("projects").findOne({ slug: id });
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

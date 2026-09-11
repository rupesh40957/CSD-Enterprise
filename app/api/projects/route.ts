import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { projectSchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { Project } from "@/models/Project";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featuredOnly = searchParams.get("featured") === "true";
    const slug = searchParams.get("slug");

    const filter: Record<string, unknown> = {};
    if (!isAdmin) filter.active = true;
    if (category && category !== "All") filter.category = category;
    if (featuredOnly) filter.featured = true;
    if (slug) filter.slug = slug;

    const db = await getDatabase();
    const projects = await db
      .collection<Project>("projects")
      .find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .toArray();

    return NextResponse.json({
      projects,
      total: projects.length,
    });
  } catch (error) {
    console.error("Error fetching projects:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ projects: [], total: 0 });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = projectSchema.safeParse(body);

    if (!result.success) {
      const issue = result.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const db = await getDatabase();
    const projectsCollection = db.collection<Project>("projects");

    const slug = result.data.slug ? slugify(result.data.slug) : slugify(result.data.title);

    const newProject: Project = {
      ...result.data,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertResult = await projectsCollection.insertOne(newProject);

    return NextResponse.json(
      {
        success: true,
        message: "Project added successfully.",
        id: insertResult.insertedId,
        project: newProject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding project:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to add project." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body._id) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

    const result = projectSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const payload = { ...result.data, updatedAt: new Date() };
    if (payload.title && !payload.slug) {
      payload.slug = slugify(payload.title);
    } else if (payload.slug) {
      payload.slug = slugify(payload.slug);
    }

    const db = await getDatabase();
    await db.collection("projects").updateOne(
      { _id: new ObjectId(body._id) },
      { $set: payload }
    );
    return NextResponse.json({ success: true, message: "Project updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = await getDatabase();
    await db.collection("projects").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

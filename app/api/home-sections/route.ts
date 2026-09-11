import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { homeSectionSchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { HomeSection } from "@/models";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    const db = await getDatabase();
    const filter = isAdmin ? {} : { isActive: true };
    const sections = await db.collection<HomeSection>("homeSections").find(filter).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json({ sections });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch home sections" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const db = await getDatabase();

    // Reorder whole array of sections
    if (Array.isArray(body.sections)) {
      for (const s of body.sections) {
        if (s._id) {
          await db.collection("homeSections").updateOne(
            { _id: new ObjectId(s._id) },
            {
              $set: {
                sortOrder: s.sortOrder,
                isActive: s.isActive ?? true,
                title: s.title || "",
                subtitle: s.subtitle || "",
                updatedAt: new Date(),
              },
            }
          );
        }
      }
      return NextResponse.json({ success: true, message: "Sections reordered successfully" });
    }

    // Single section update
    if (!body._id) return NextResponse.json({ error: "Section ID required" }, { status: 400 });
    const result = homeSectionSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    await db.collection("homeSections").updateOne(
      { _id: new ObjectId(body._id) },
      { $set: { ...result.data, updatedAt: new Date() } }
    );
    return NextResponse.json({ success: true, message: "Section updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update sections" }, { status: 500 });
  }
}

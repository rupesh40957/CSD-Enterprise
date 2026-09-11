import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { industrySchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { Industry } from "@/models";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    const db = await getDatabase();
    const filter = isAdmin ? {} : { isActive: true };
    const industries = await db.collection<Industry>("industries").find(filter).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json({ industries, total: industries.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = industrySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const db = await getDatabase();
    const slug = result.data.slug ? slugify(result.data.slug) : slugify(result.data.title);

    const newIndustry: Industry = {
      ...result.data,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection<Industry>("industries").insertOne(newIndustry);
    return NextResponse.json({ success: true, id: res.insertedId, industry: newIndustry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create industry" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body._id) return NextResponse.json({ error: "Industry ID required" }, { status: 400 });

    const result = industrySchema.partial().safeParse(body);
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
    await db.collection("industries").updateOne(
      { _id: new ObjectId(body._id) },
      { $set: payload }
    );
    return NextResponse.json({ success: true, message: "Industry updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update industry" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Industry ID required" }, { status: 400 });

    const db = await getDatabase();
    await db.collection("industries").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: "Industry deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete industry" }, { status: 500 });
  }
}

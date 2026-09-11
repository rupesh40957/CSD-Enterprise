import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { faqSchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { Faq } from "@/models";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const filter: Record<string, unknown> = {};
    if (!isAdmin) filter.isActive = true;
    if (category && category !== "All") filter.category = category;

    const db = await getDatabase();
    const faqs = await db.collection<Faq>("faqs").find(filter).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json({ faqs, total: faqs.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch faqs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = faqSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const db = await getDatabase();
    const newFaq: Faq = {
      ...result.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = await db.collection<Faq>("faqs").insertOne(newFaq);
    return NextResponse.json({ success: true, id: res.insertedId, faq: newFaq }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create faq" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body._id) return NextResponse.json({ error: "FAQ ID required" }, { status: 400 });

    const result = faqSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const db = await getDatabase();
    await db.collection("faqs").updateOne(
      { _id: new ObjectId(body._id) },
      { $set: { ...result.data, updatedAt: new Date() } }
    );
    return NextResponse.json({ success: true, message: "FAQ updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update faq" }, { status: 500 });
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
    await db.collection("faqs").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete faq" }, { status: 500 });
  }
}

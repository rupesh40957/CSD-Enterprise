import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { heroSlideSchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { HeroSlide } from "@/models";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    const db = await getDatabase();
    const filter = isAdmin ? {} : { isActive: true };
    const slides = await db.collection<HeroSlide>("heroSlides").find(filter).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json({ slides });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hero slides" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = heroSlideSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const db = await getDatabase();
    const slide: HeroSlide = {
      ...result.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = await db.collection<HeroSlide>("heroSlides").insertOne(slide);
    return NextResponse.json({ success: true, id: res.insertedId, slide }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create hero slide" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body._id) return NextResponse.json({ error: "Slide ID required" }, { status: 400 });

    const result = heroSlideSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const db = await getDatabase();
    await db.collection("heroSlides").updateOne(
      { _id: new ObjectId(body._id) },
      { $set: { ...result.data, updatedAt: new Date() } }
    );
    return NextResponse.json({ success: true, message: "Hero slide updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update hero slide" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Slide ID required" }, { status: 400 });

    const db = await getDatabase();
    await db.collection("heroSlides").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: "Hero slide deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete hero slide" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { navigationSchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { NavigationItem } from "@/models";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    const db = await getDatabase();
    const filter = isAdmin ? {} : { isActive: true };
    const items = await db.collection<NavigationItem>("navigation").find(filter).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch navigation items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = navigationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const db = await getDatabase();
    const newItem: NavigationItem = {
      ...result.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = await db.collection<NavigationItem>("navigation").insertOne(newItem);
    return NextResponse.json({ success: true, id: res.insertedId, item: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create navigation item" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const db = await getDatabase();

    // If batch reordering array provided
    if (Array.isArray(body.items)) {
      for (const item of body.items) {
        if (item._id) {
          await db.collection("navigation").updateOne(
            { _id: new ObjectId(item._id) },
            { $set: { sortOrder: item.sortOrder, isActive: item.isActive ?? true, updatedAt: new Date() } }
          );
        }
      }
      return NextResponse.json({ success: true, message: "Navigation reordered successfully" });
    }

    // Single item update
    if (!body._id) return NextResponse.json({ error: "Item ID required" }, { status: 400 });
    const result = navigationSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    await db.collection("navigation").updateOne(
      { _id: new ObjectId(body._id) },
      { $set: { ...result.data, updatedAt: new Date() } }
    );
    return NextResponse.json({ success: true, message: "Navigation item updated" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update navigation" }, { status: 500 });
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
    await db.collection("navigation").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: "Navigation item deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete navigation item" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { serviceSchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { Service } from "@/models";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");

    const filter: Record<string, unknown> = {};
    if (!isAdmin) filter.isActive = true;
    if (featured === "true") filter.featured = true;

    const db = await getDatabase();
    const services = await db.collection<Service>("services").find(filter).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json({ services, total: services.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = serviceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const db = await getDatabase();
    const slug = result.data.slug ? slugify(result.data.slug) : slugify(result.data.title);

    const newService: Service = {
      ...result.data,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection<Service>("services").insertOne(newService);
    return NextResponse.json({ success: true, id: res.insertedId, service: newService }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body._id) return NextResponse.json({ error: "Service ID required" }, { status: 400 });

    const result = serviceSchema.partial().safeParse(body);
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
    await db.collection("services").updateOne(
      { _id: new ObjectId(body._id) },
      { $set: payload }
    );
    return NextResponse.json({ success: true, message: "Service updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Service ID required" }, { status: 400 });

    const db = await getDatabase();
    await db.collection("services").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}

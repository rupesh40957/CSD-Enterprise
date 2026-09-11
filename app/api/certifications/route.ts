import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { certificationSchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { Certification } from "@/models";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    const db = await getDatabase();
    const filter = isAdmin ? {} : { isActive: true };
    const certifications = await db.collection<Certification>("certifications").find(filter).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json({ certifications, total: certifications.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = certificationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const db = await getDatabase();
    const newCert: Certification = {
      ...result.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = await db.collection<Certification>("certifications").insertOne(newCert);
    return NextResponse.json({ success: true, id: res.insertedId, certification: newCert }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body._id) return NextResponse.json({ error: "Certification ID required" }, { status: 400 });

    const result = certificationSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const db = await getDatabase();
    await db.collection("certifications").updateOne(
      { _id: new ObjectId(body._id) },
      { $set: { ...result.data, updatedAt: new Date() } }
    );
    return NextResponse.json({ success: true, message: "Certification updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 });
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
    await db.collection("certifications").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: "Certification deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}

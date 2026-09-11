import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { clientSchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { Client } from "@/models";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    const db = await getDatabase();
    const filter = isAdmin ? {} : { isActive: true };
    const clients = await db.collection<Client>("clients").find(filter).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json({ clients, total: clients.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = clientSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const db = await getDatabase();
    const newClient: Client = {
      ...result.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const res = await db.collection<Client>("clients").insertOne(newClient);
    return NextResponse.json({ success: true, id: res.insertedId, client: newClient }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body._id) return NextResponse.json({ error: "Client ID required" }, { status: 400 });

    const result = clientSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const db = await getDatabase();
    await db.collection("clients").updateOne(
      { _id: new ObjectId(body._id) },
      { $set: { ...result.data, updatedAt: new Date() } }
    );
    return NextResponse.json({ success: true, message: "Client updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
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
    await db.collection("clients").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}

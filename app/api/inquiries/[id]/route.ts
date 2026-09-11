import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { verifyAdminRequest } from "@/lib/auth";
import { updateInquiryStatusSchema } from "@/lib/validation";
import { updateLocalInquiry, deleteLocalInquiry } from "@/lib/storage";
import { Inquiry } from "@/models/Inquiry";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateInquiryStatusSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    if (id.startsWith("local_")) {
      updateLocalInquiry(id, result.data.status);
      return NextResponse.json({ success: true, message: `Status updated to ${result.data.status}` });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid inquiry ID." }, { status: 400 });
    }

    try {
      const db = await getDatabase();
      const inquiriesCollection = db.collection<Inquiry>("inquiries");

      await inquiriesCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: result.data.status,
            updatedAt: new Date(),
          },
        }
      );
    } catch {
      updateLocalInquiry(id, result.data.status);
    }

    return NextResponse.json({
      success: true,
      message: `Inquiry status updated to ${result.data.status}`,
    });
  } catch (error) {
    console.error("Error updating inquiry:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to update inquiry." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (id.startsWith("local_")) {
      deleteLocalInquiry(id);
      return NextResponse.json({ success: true, message: "Inquiry deleted successfully." });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid inquiry ID." }, { status: 400 });
    }

    try {
      const db = await getDatabase();
      const inquiriesCollection = db.collection<Inquiry>("inquiries");
      await inquiriesCollection.deleteOne({ _id: new ObjectId(id) });
    } catch {
      deleteLocalInquiry(id);
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting inquiry:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to delete inquiry." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { inquirySchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { checkRateLimit } from "@/lib/utils";
import { saveLocalInquiry, getLocalInquiries } from "@/lib/storage";
import { Inquiry } from "@/models/Inquiry";
import type { Filter } from "mongodb";

export const dynamic = "force-dynamic";

// Public: Submit inquiry/RFQ
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local-client";
    const allowed = checkRateLimit(`inquiry-${ip}`, 10, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many inquiries submitted from this connection. Please try again shortly." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = inquirySchema.safeParse(body);

    if (!result.success) {
      const issue = result.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const newInquiry: Inquiry = {
      fullName: result.data.fullName,
      workEmail: result.data.workEmail,
      phone: result.data.phone,
      organization: result.data.organization,
      solution: result.data.solution,
      message: result.data.message,
      status: "New",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let insertedId: unknown = null;

    try {
      const db = await getDatabase();
      const inquiriesCollection = db.collection<Inquiry>("inquiries");
      const insertResult = await inquiriesCollection.insertOne(newInquiry);
      insertedId = insertResult.insertedId;
    } catch (dbErr) {
      console.warn("Atlas direct write failed, saving to fail-safe buffer:", dbErr instanceof Error ? dbErr.message : "Unknown error");
      const saved = saveLocalInquiry(newInquiry);
      insertedId = saved._id;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been successfully submitted. An engineering specialist from CSD Enterprises will review your requirements and respond promptly.",
        id: insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating inquiry:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to record inquiry. Please reach out to support@csdenterprises.in directly." },
      { status: 500 }
    );
  }
}

// Protected: Admin list inquiries
export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const status = searchParams.get("status")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    let dbInquiries: Inquiry[] = [];
    let totalCount = 0;
    let newCount = 0;
    let contactedCount = 0;
    let inReviewCount = 0;
    let completedCount = 0;

    try {
      const db = await getDatabase();
      const inquiriesCollection = db.collection<Inquiry>("inquiries");

      const filter: Filter<Inquiry> = {};
      if (status && status !== "All") {
        filter.status = status as Inquiry["status"];
      }
      if (search) {
        filter.$or = [
          { fullName: { $regex: search, $options: "i" } },
          { workEmail: { $regex: search, $options: "i" } },
          { organization: { $regex: search, $options: "i" } },
          { solution: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }

      [dbInquiries, totalCount, newCount, contactedCount, inReviewCount, completedCount] = await Promise.all([
        inquiriesCollection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
        inquiriesCollection.countDocuments(filter),
        inquiriesCollection.countDocuments({ status: "New" }),
        inquiriesCollection.countDocuments({ status: "Contacted" }),
        inquiriesCollection.countDocuments({ status: "In Review" }),
        inquiriesCollection.countDocuments({ status: "Completed" }),
      ]);
    } catch (dbErr) {
      console.warn("Atlas query failed, serving from local buffer:", dbErr instanceof Error ? dbErr.message : "Unknown error");
      // Fallback to local buffer
      let localItems = getLocalInquiries();
      if (status && status !== "All") {
        localItems = localItems.filter((i) => i.status === status);
      }
      if (search) {
        localItems = localItems.filter(
          (i) =>
            i.fullName.toLowerCase().includes(search) ||
            i.organization.toLowerCase().includes(search) ||
            i.workEmail.toLowerCase().includes(search) ||
            i.solution.toLowerCase().includes(search)
        );
      }

      totalCount = localItems.length;
      newCount = localItems.filter((i) => i.status === "New").length;
      contactedCount = localItems.filter((i) => i.status === "Contacted").length;
      inReviewCount = localItems.filter((i) => i.status === "In Review").length;
      completedCount = localItems.filter((i) => i.status === "Completed").length;
      dbInquiries = localItems.slice(skip, skip + limit);
    }

    return NextResponse.json({
      inquiries: dbInquiries,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      },
      counts: {
        all: totalCount,
        new: newCount,
        contacted: contactedCount,
        inReview: inReviewCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to fetch inquiries." }, { status: 500 });
  }
}

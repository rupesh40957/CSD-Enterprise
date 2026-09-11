import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { websiteSettingsSchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { WebsiteSettings } from "@/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDatabase();
    const settings = await db.collection<WebsiteSettings>("websiteSettings").findOne({});
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET /api/settings error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = websiteSettingsSchema.safeParse(body);
    if (!result.success) {
      const issue = result.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const db = await getDatabase();
    const payload = {
      ...result.data,
      updatedAt: new Date(),
    };

    await db.collection<WebsiteSettings>("websiteSettings").updateOne(
      {},
      { $set: payload },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Settings updated successfully", settings: payload });
  } catch (error) {
    console.error("PUT /api/settings error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

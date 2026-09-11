import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { aboutContentSchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { AboutContent } from "@/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDatabase();
    const about = await db.collection<AboutContent>("aboutContent").findOne({});
    return NextResponse.json({ about });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch about content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = aboutContentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const db = await getDatabase();
    const payload = {
      ...result.data,
      updatedAt: new Date(),
    };

    await db.collection<AboutContent>("aboutContent").updateOne(
      {},
      { $set: payload },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "About content updated successfully", about: payload });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update about content" }, { status: 500 });
  }
}

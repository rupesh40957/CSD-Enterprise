import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ctaContentSchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { CtaContent } from "@/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDatabase();
    const cta = await db.collection<CtaContent>("ctaContent").findOne({});
    return NextResponse.json({ cta });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch CTA content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = ctaContentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const db = await getDatabase();
    const payload = {
      ...result.data,
      updatedAt: new Date(),
    };

    await db.collection<CtaContent>("ctaContent").updateOne(
      {},
      { $set: payload },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "CTA banner updated successfully", cta: payload });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update CTA banner" }, { status: 500 });
  }
}

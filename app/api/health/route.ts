import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus: "connected" | "disconnected" = "disconnected";

  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });
    dbStatus = "connected";
  } catch (err) {
    console.error("Health check database ping failed:", err instanceof Error ? err.message : "Unknown error");
    dbStatus = "disconnected";
  }

  return NextResponse.json(
    {
      status: "ok",
      database: dbStatus,
      timestamp: new Date().toISOString(),
      service: "CSD Enterprises Enterprise Core",
    },
    { status: dbStatus === "connected" ? 200 : 503 }
  );
}

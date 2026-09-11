import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { exec } from "child_process";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return new Promise<NextResponse>((resolve) => {
    const seedScript = path.join(process.cwd(), "scripts", "seed.js");
    exec(`node "${seedScript}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("Seed execution failed:", stderr || error.message);
        resolve(NextResponse.json({ error: "Seeding failed", details: stderr || error.message }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ success: true, message: "Database re-seeded successfully", output: stdout }));
      }
    });
  });
}

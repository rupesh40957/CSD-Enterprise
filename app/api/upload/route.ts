import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyAdminRequest } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { Media } from "@/models";

export const dynamic = "force-dynamic";

// Allowed MIME types and max size (10 MB)
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const customAlt = (formData.get("alt") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type (${file.type}). Allowed formats: JPG, PNG, WebP, SVG, GIF`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit. Please upload a smaller image." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Target upload directory inside public
    const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Sanitize filename & generate timestamped unique name
    const ext = path.extname(file.name) || `.${file.type.split("/")[1] || "png"}`;
    const baseName = path.basename(file.name, ext).replace(/[^\w-]/g, "_").slice(0, 50);
    const uniqueFilename = `${Date.now()}_${baseName}${ext}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    await writeFile(filePath, buffer);

    const publicUrl = `/images/uploads/${uniqueFilename}`;

    // Index into MongoDB media collection for Admin Media Library visibility
    try {
      const db = await getDatabase();
      await db.collection<Media>("media").insertOne({
        url: publicUrl,
        filename: file.name,
        alt: customAlt || file.name,
        type: file.type,
        sizeBytes: file.size,
        createdAt: new Date(),
      });
    } catch (dbErr) {
      console.warn("Failed to index media asset in database:", dbErr);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      originalName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Image upload failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to upload image. Server error." },
      { status: 500 }
    );
  }
}

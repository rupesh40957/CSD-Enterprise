import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
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
    const requestedAccess = (formData.get("access") as string) || "public";
    const access: "public" | "private" = requestedAccess === "private" ? "private" : "public";

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

    // Sanitize filename & generate timestamped unique name
    const ext = path.extname(file.name) || `.${file.type.split("/")[1] || "png"}`;
    const baseName = path.basename(file.name, ext).replace(/[^\w-]/g, "_").slice(0, 50);
    const uniqueFilename = `${Date.now()}_${baseName}${ext}`;

    let publicUrl = "";

    // 1. If Vercel Blob token is set (Vercel production or local with BLOB_READ_WRITE_TOKEN)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${uniqueFilename}`, file, {
        access,
        contentType: file.type,
      });
      publicUrl = blob.url;
    } else {
      // 2. Local development fallback (writes to public/images/uploads when running locally without token)
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");
        await mkdir(uploadsDir, { recursive: true });
        const filePath = path.join(uploadsDir, uniqueFilename);
        await writeFile(filePath, buffer);
        publicUrl = `/images/uploads/${uniqueFilename}`;
      } catch (fsErr) {
        console.error("Filesystem write error:", fsErr);
        return NextResponse.json(
          {
            error:
              "Upload failed: Read-only filesystem detected. Please connect Vercel Blob in your Vercel Dashboard (Storage -> Create Blob).",
          },
          { status: 500 }
        );
      }
    }

    // Index into MongoDB media collection for Admin Media Library visibility
    try {
      const db = await getDatabase();
      await db.collection<Media>("media").insertOne({
        url: publicUrl,
        filename: file.name,
        alt: customAlt || file.name,
        type: file.type,
        sizeBytes: file.size,
        access,
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
      access,
    });
  } catch (error) {
    console.error("Image upload failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload image. Server error.",
      },
      { status: 500 }
    );
  }
}

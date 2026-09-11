import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { verifyAdminRequest } from "@/lib/auth";
import { Media } from "@/models";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const media = await db.collection<Media>("media").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ media, total: media.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const contentType = request.headers.get("content-type") || "";

    // Handle JSON payload (URL or base64)
    if (contentType.includes("application/json")) {
      const body = await request.json();

      let finalUrl = body.url;
      const filename = body.filename || `asset_${Date.now()}`;
      const alt = body.alt || "CSD Enterprises Media Asset";

      // If base64 data was provided
      if (body.base64 && body.base64.includes(";base64,")) {
        const parts = body.base64.split(";base64,");
        const mime = parts[0].split(":")[1] || "image/png";
        const ext = mime.split("/")[1] || "png";
        const buffer = Buffer.from(parts[1], "base64");

        const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const safeFilename = `${Date.now()}_${filename.replace(/[^\w.-]/g, "")}.${ext}`;
        const filePath = path.join(uploadsDir, safeFilename);
        fs.writeFileSync(filePath, buffer);
        finalUrl = `/images/uploads/${safeFilename}`;
      }

      if (!finalUrl) {
        return NextResponse.json({ error: "Media URL or base64 data required" }, { status: 400 });
      }

      const db = await getDatabase();
      const newMedia: Media = {
        url: finalUrl,
        filename,
        alt,
        type: body.type || "image",
        createdAt: new Date(),
      };

      const res = await db.collection<Media>("media").insertOne(newMedia);
      return NextResponse.json({ success: true, id: res.insertedId, media: newMedia }, { status: 201 });
    }

    // Handle multipart/form-data file upload
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const ext = path.extname(file.name) || ".png";
      const baseName = path.basename(file.name, ext).replace(/[^\w.-]/g, "_").slice(0, 50);
      const safeFilename = `${Date.now()}_${baseName}${ext}`;
      const filePath = path.join(uploadsDir, safeFilename);
      fs.writeFileSync(filePath, buffer);

      const finalUrl = `/images/uploads/${safeFilename}`;
      const db = await getDatabase();
      const newMedia: Media = {
        url: finalUrl,
        filename: file.name,
        alt: (formData.get("alt") as string) || file.name,
        type: file.type || "image",
        sizeBytes: file.size,
        createdAt: new Date(),
      };

      const res = await db.collection<Media>("media").insertOne(newMedia);
      return NextResponse.json({ success: true, id: res.insertedId, media: newMedia, url: finalUrl }, { status: 201 });
    }

    return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
  } catch (error) {
    console.error("Media upload error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to upload media" }, { status: 500 });
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
    await db.collection("media").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: "Media deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { blogPostSchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { BlogPost } from "@/models";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminRequest(request);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = {};
    if (!isAdmin) filter.isPublished = true;
    if (category && category !== "All") filter.category = category;

    const db = await getDatabase();
    const posts = await db
      .collection<BlogPost>("blogPosts")
      .find(filter)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ posts, total: posts.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = blogPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const slug = result.data.slug ? slugify(result.data.slug) : slugify(result.data.title);

    const db = await getDatabase();
    const newPost: BlogPost = {
      ...result.data,
      slug,
      publishedAt: result.data.publishedAt ? new Date(result.data.publishedAt) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await db.collection<BlogPost>("blogPosts").insertOne(newPost);
    return NextResponse.json({ success: true, id: res.insertedId, post: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body._id) return NextResponse.json({ error: "Post ID required" }, { status: 400 });

    const result = blogPostSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || "Validation failed" }, { status: 400 });
    }

    const payload = { ...result.data, updatedAt: new Date() };
    if (payload.title && !payload.slug) {
      payload.slug = slugify(payload.title);
    } else if (payload.slug) {
      payload.slug = slugify(payload.slug);
    }
    if (payload.publishedAt) {
      payload.publishedAt = new Date(payload.publishedAt);
    }

    const db = await getDatabase();
    await db.collection("blogPosts").updateOne(
      { _id: new ObjectId(body._id) },
      { $set: payload }
    );
    return NextResponse.json({ success: true, message: "Blog post updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
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
    await db.collection("blogPosts").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}

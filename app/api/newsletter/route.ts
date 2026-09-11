import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { newsletterSchema } from "@/lib/validation";
import { verifyAdminRequest } from "@/lib/auth";
import { checkRateLimit } from "@/lib/utils";
import { saveLocalSubscriber, getLocalSubscribers } from "@/lib/storage";
import { Subscriber } from "@/models/Subscriber";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local-client";
    const allowed = checkRateLimit(`newsletter-${ip}`, 8, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many subscription attempts. Please wait." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Please enter a valid business email address." },
        { status: 400 }
      );
    }

    const email = result.data.email.toLowerCase().trim();

    try {
      const db = await getDatabase();
      const subscribersCollection = db.collection<Subscriber>("subscribers");

      const existing = await subscribersCollection.findOne({ email });
      if (existing) {
        return NextResponse.json({
          success: true,
          message: "This email is already subscribed to engineering updates.",
        });
      }

      await subscribersCollection.insertOne({
        email,
        createdAt: new Date(),
      });
    } catch {
      saveLocalSubscriber(email);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for subscribing to CSD Enterprises technical bulletins.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to process subscription." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const isAdmin = await verifyAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");
    const search = searchParams.get("search")?.trim().toLowerCase() || "";

    let subscribers: Subscriber[] = [];

    try {
      const db = await getDatabase();
      const subscribersCollection = db.collection<Subscriber>("subscribers");
      const filter = search ? { email: { $regex: search, $options: "i" } } : {};
      subscribers = await subscribersCollection.find(filter).sort({ createdAt: -1 }).toArray();
    } catch {
      let localItems = getLocalSubscribers();
      if (search) {
        localItems = localItems.filter((s) => s.email.toLowerCase().includes(search));
      }
      subscribers = localItems;
    }

    // Secure CSV Export for Admin
    if (format === "csv") {
      const csvRows = ["Email,Subscribed Date"];
      subscribers.forEach((s) => {
        const dateStr = s.createdAt ? new Date(s.createdAt).toISOString() : "";
        csvRows.push(`"${s.email.replace(/"/g, '""')}","${dateStr}"`);
      });
      const csvContent = csvRows.join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="csd-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({
      subscribers,
      total: subscribers.length,
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to fetch subscribers." }, { status: 500 });
  }
}

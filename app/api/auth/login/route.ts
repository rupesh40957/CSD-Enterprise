import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { verifyAdminCredentials, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local-client";
    const allowed = checkRateLimit(`login-${ip}`, 10, 60000); // 10 attempts per minute max
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait 60 seconds before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Invalid credentials submission.";
      return NextResponse.json(
        { error: issue },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const authResult = await verifyAdminCredentials(email, password);

    if (!authResult.valid || !authResult.admin) {
      return NextResponse.json(
        { error: "Invalid administrator email or password." },
        { status: 401 }
      );
    }

    const { email: adminEmail, role, mustChangePassword, name } = authResult.admin;
    const token = await createSessionToken(adminEmail, role, mustChangePassword, name);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful.",
      mustChangePassword,
      user: {
        email: adminEmail,
        name,
        role,
        mustChangePassword,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}

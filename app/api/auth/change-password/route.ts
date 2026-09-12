import { NextRequest, NextResponse } from "next/server";
import { changePasswordSchema } from "@/lib/validation";
import {
  verifyAdminRequest,
  verifyAdminCredentials,
  updateAdminPassword,
  createSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await verifyAdminRequest(request);
    if (!session || !session.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = changePasswordSchema.safeParse(body);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Invalid password data submitted.";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const { currentPassword, newPassword } = parseResult.data;

    // Verify current password first
    const verifyCurrent = await verifyAdminCredentials(session.email, currentPassword);
    if (!verifyCurrent.valid) {
      return NextResponse.json(
        { error: "Current password is incorrect. Please check and try again." },
        { status: 400 }
      );
    }

    // Update password in database
    const success = await updateAdminPassword(session.email, newPassword);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update password in system. Please try again." },
        { status: 500 }
      );
    }

    // Refresh session cookie with mustChangePassword = false
    const newToken = await createSessionToken(
      session.email,
      session.role,
      false,
      session.name || "Administrator"
    );

    const response = NextResponse.json({
      success: true,
      message: "Password updated successfully. Your new password is now active.",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Change password error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "An unexpected server error occurred while updating password." },
      { status: 500 }
    );
  }
}

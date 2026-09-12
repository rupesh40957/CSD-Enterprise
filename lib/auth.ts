import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { AdminUser } from "@/models/AdminUser";

export const SESSION_COOKIE_NAME = "csd_admin_session";
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-development-must-be-replaced";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface AdminSessionPayload {
  sub: string;
  email: string;
  role: "admin" | "superadmin";
  name?: string;
  mustChangePassword?: boolean;
  iat?: number;
  exp?: number;
}

export interface AdminAuthResult {
  valid: boolean;
  admin?: {
    email: string;
    name: string;
    role: "admin" | "superadmin";
    mustChangePassword: boolean;
  };
}

export async function createSessionToken(
  email = "admin@csdenterprises.in",
  role: "admin" | "superadmin" = "admin",
  mustChangePassword = false,
  name = "Administrator"
): Promise<string> {
  return await new SignJWT({ role, email, mustChangePassword, name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if ((payload.role === "admin" || payload.role === "superadmin") && payload.sub === "admin") {
      return payload as unknown as AdminSessionPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export async function verifyAdminCredentials(email: string, password: string): Promise<AdminAuthResult> {
  const normEmail = email.toLowerCase().trim();

  // 1. Check MongoDB admins collection
  try {
    const db = await getDatabase();
    const adminsCol = db.collection<AdminUser>("admins");
    const admin = await adminsCol.findOne({ email: normEmail });

    if (admin && admin.passwordHash) {
      const hash = admin.passwordHash.replace(/\\/g, "").trim();
      const isMatch = await bcrypt.compare(password, hash);
      if (isMatch) {
        // update lastLoginAt
        adminsCol.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } }).catch(() => {});
        return {
          valid: true,
          admin: {
            email: admin.email,
            name: admin.name || "Administrator",
            role: admin.role || "admin",
            mustChangePassword: Boolean(admin.mustChangePassword),
          },
        };
      }
    }
  } catch (dbError) {
    console.warn("Could not verify against MongoDB admins collection, checking fallback:", dbError);
  }

  // 2. Fallback for environment variable master admin
  const configuredEmail = (process.env.ADMIN_EMAIL || "admin@csdenterprises.in").toLowerCase().trim();
  if (normEmail === configuredEmail) {
    let adminHash = process.env.ADMIN_PASSWORD_HASH;
    if (adminHash) {
      adminHash = adminHash.replace(/\\/g, "").trim();
      const isMatch = await bcrypt.compare(password, adminHash);
      if (isMatch) {
        return {
          valid: true,
          admin: {
            email: configuredEmail,
            name: "Primary Administrator",
            role: "superadmin",
            mustChangePassword: true,
          },
        };
      }
    }
  }

  return { valid: false };
}

export async function updateAdminPassword(email: string, newPassword: string): Promise<boolean> {
  const normEmail = email.toLowerCase().trim();
  try {
    const db = await getDatabase();
    const adminsCol = db.collection<AdminUser>("admins");
    const newHash = await bcrypt.hash(newPassword, 10);
    const result = await adminsCol.updateOne(
      { email: normEmail },
      {
        $set: {
          passwordHash: newHash,
          mustChangePassword: false,
          updatedAt: new Date(),
        },
      },
      { upsert: false }
    );
    return result.matchedCount > 0;
  } catch (err) {
    console.error("Failed to update admin password in database:", err);
    return false;
  }
}

export async function getAdminSessionFromCookies(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function verifyAdminRequest(request: NextRequest): Promise<AdminSessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "csd_admin_session";
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-development-must-be-replaced";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface AdminSessionPayload {
  sub: string;
  email: string;
  role: "admin";
  iat?: number;
  exp?: number;
}

export async function createSessionToken(email = "admin@csdenterprises.in"): Promise<string> {
  return await new SignJWT({ role: "admin", email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.role === "admin" && payload.sub === "admin") {
      return payload as unknown as AdminSessionPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const configuredEmail = (process.env.ADMIN_EMAIL || "admin@csdenterprises.in").toLowerCase().trim();
  if (email.toLowerCase().trim() !== configuredEmail) {
    return false;
  }

  let adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminHash) {
    console.error("ADMIN_PASSWORD_HASH is not configured in server environment");
    return false;
  }
  // Strip any escaping backslashes from .env file expansion
  adminHash = adminHash.replace(/\\/g, "").trim();
  return await bcrypt.compare(password, adminHash);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return verifyAdminCredentials("admin@csdenterprises.in", password);
}

export async function getAdminSessionFromCookies(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function verifyAdminRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return false;
  const session = await verifySessionToken(token);
  return session !== null;
}

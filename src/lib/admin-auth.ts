import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { timingSafeStringEqual, verifyPassword } from "@/lib/password";

const ADMIN_COOKIE = "avi-admin-session";

export class AdminAuthDatabaseError extends Error {
  constructor() {
    super("Admin authentication database lookup failed.");
    this.name = "AdminAuthDatabaseError";
  }
}

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.NEXTAUTH_SECRET ?? "avi-firstbreath-local-admin-secret";
}

function signValue(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function signAdminSession(value: string) {
  const payload = Buffer.from(value, "utf8").toString("base64url");
  return `v2.${payload}.${signValue(payload)}`;
}

export function verifyAdminSession(session: string | undefined) {
  if (!session) return false;
  const decodedSession = safeDecodeCookieValue(session);

  if (decodedSession.startsWith("v2.")) {
    const [, payload, signature] = decodedSession.split(".");
    if (!payload || !signature || !safeEqual(signature, signValue(payload))) return false;

    try {
      return Buffer.from(payload, "base64url").toString("utf8").startsWith("admin:");
    } catch {
      return false;
    }
  }

  const separator = decodedSession.lastIndexOf(".");
  if (separator <= 0) return false;
  const value = decodedSession.slice(0, separator);
  const signature = decodedSession.slice(separator + 1);
  if (!value || !signature || !value.startsWith("admin:")) return false;
  return safeEqual(signature, signValue(value));
}

function safeDecodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function authenticateAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const fallbackEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const fallbackPassword = process.env.ADMIN_PASSWORD;

  if (
    fallbackEmail &&
    fallbackPassword &&
    normalizedEmail === fallbackEmail &&
    timingSafeStringEqual(password, fallbackPassword)
  ) {
    return { id: "env-admin", email: fallbackEmail, name: "Admin" };
  }

  let user: Awaited<ReturnType<typeof prisma.user.findUnique>>;

  try {
    user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  } catch (error) {
    console.error("Admin authentication database lookup failed", error);
    throw new AdminAuthDatabaseError();
  }

  if (user?.role === "ADMIN" && (await verifyPassword(password, user.passwordHash))) {
    return { id: user.id, email: user.email, name: user.name ?? "Admin" };
  }

  return null;
}

export { ADMIN_COOKIE };

import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { timingSafeStringEqual, verifyPassword } from "@/lib/password";

const ADMIN_COOKIE = "avi-admin-session";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.NEXTAUTH_SECRET ?? "avi-firstbreath-local-admin-secret";
}

export function signAdminSession(value: string) {
  const signature = crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
  return `${value}.${signature}`;
}

export function verifyAdminSession(session: string | undefined) {
  if (!session) return false;
  const separator = session.lastIndexOf(".");
  if (separator <= 0) return false;
  const value = session.slice(0, separator);
  const signature = session.slice(separator + 1);
  if (!value || !signature) return false;
  const expected = signAdminSession(value).split(".")[1];
  return Buffer.from(signature).length === Buffer.from(expected).length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function authenticateAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } }).catch(() => null);

  if (user?.role === "ADMIN" && (await verifyPassword(password, user.passwordHash))) {
    return { id: user.id, email: user.email, name: user.name ?? "Admin" };
  }

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

  return null;
}

export { ADMIN_COOKIE };

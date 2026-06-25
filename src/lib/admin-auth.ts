import crypto from "crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "avi-admin-session";
const SESSION_VALUE = "admin";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.NEXTAUTH_SECRET ?? "avi-firstbreath-local-admin-secret";
}

export function getAdminAccessCode() {
  return process.env.ADMIN_ACCESS_CODE ?? "AVI-FIRSTBREATH-ADMIN";
}

export function signAdminSession(value = SESSION_VALUE) {
  const signature = crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
  return `${value}.${signature}`;
}

export function verifyAdminSession(session: string | undefined) {
  if (!session) return false;
  const [value, signature] = session.split(".");
  if (value !== SESSION_VALUE || !signature) return false;
  const expected = signAdminSession(value).split(".")[1];
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
}

export { ADMIN_COOKIE };

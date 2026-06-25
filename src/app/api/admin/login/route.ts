import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminAccessCode, signAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { accessCode?: string } | null;
  const accessCode = body?.accessCode?.trim();

  if (!accessCode || accessCode !== getAdminAccessCode()) {
    return NextResponse.json({ ok: false, error: "Invalid admin access code." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, signAdminSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}

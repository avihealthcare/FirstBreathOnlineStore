import { NextResponse } from "next/server";
import { ADMIN_COOKIE, AdminAuthDatabaseError, authenticateAdmin, signAdminSession } from "@/lib/admin-auth";
import { adminLoginSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.errors[0]?.message ?? "Invalid login details." }, { status: 400 });
  }

  let admin: Awaited<ReturnType<typeof authenticateAdmin>>;

  try {
    admin = await authenticateAdmin(parsed.data.email, parsed.data.password);
  } catch (error) {
    if (error instanceof AdminAuthDatabaseError) {
      return NextResponse.json(
        { ok: false, error: "Admin database connection is busy. Please try again in a minute." },
        { status: 503 }
      );
    }

    throw error;
  }

  if (!admin) {
    return NextResponse.json({ ok: false, error: "Invalid admin email or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, admin: { email: admin.email, name: admin.name } });
  response.cookies.set(ADMIN_COOKIE, signAdminSession(`admin:${admin.id}:${admin.email}`), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return response;
}

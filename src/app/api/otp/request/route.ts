import crypto from "crypto";
import { NextResponse } from "next/server";
import { otpRequestSchema } from "@/lib/validation";
import { normalizeMobile } from "@/lib/utils";

export const runtime = "nodejs";

type OtpRecord = {
  otpHash: string;
  expiresAt: number;
  attempts: number;
  lastRequestedAt: number;
};

const globalOtpStore = globalThis as typeof globalThis & {
  __aviOtpStore?: Map<string, OtpRecord>;
};

function getStore() {
  if (!globalOtpStore.__aviOtpStore) {
    globalOtpStore.__aviOtpStore = new Map<string, OtpRecord>();
  }
  return globalOtpStore.__aviOtpStore;
}

function hashOtp(mobile: string, otp: string) {
  return crypto.createHash("sha256").update(`${mobile}:${otp}:${process.env.NEXTAUTH_SECRET ?? "mock-secret"}`).digest("hex");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = otpRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.errors[0]?.message ?? "Invalid mobile number." }, { status: 400 });
  }

  const mobile = normalizeMobile(parsed.data.mobile);
  const store = getStore();
  const existing = store.get(mobile);
  const now = Date.now();

  if (existing && now - existing.lastRequestedAt < 30_000) {
    return NextResponse.json(
      { ok: false, error: "Please wait before requesting another OTP." },
      { status: 429 }
    );
  }

  const otp = process.env.OTP_FIXED_CODE ?? "123456";
  store.set(mobile, {
    otpHash: hashOtp(mobile, otp),
    expiresAt: now + 5 * 60_000,
    attempts: 0,
    lastRequestedAt: now
  });

  return NextResponse.json({
    ok: true,
    message: "OTP placeholder sent successfully.",
    debugOtp: process.env.NODE_ENV === "production" ? undefined : otp
  });
}

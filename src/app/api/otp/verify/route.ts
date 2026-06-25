import crypto from "crypto";
import { NextResponse } from "next/server";
import { otpVerifySchema } from "@/lib/validation";
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
  const parsed = otpVerifySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.errors[0]?.message ?? "Invalid OTP details." }, { status: 400 });
  }

  const mobile = normalizeMobile(parsed.data.mobile);
  const store = getStore();
  const record = store.get(mobile);

  if (!record) {
    return NextResponse.json({ ok: false, error: "Please request an OTP first." }, { status: 400 });
  }

  if (Date.now() > record.expiresAt) {
    store.delete(mobile);
    return NextResponse.json({ ok: false, error: "OTP expired. Please request a new OTP." }, { status: 400 });
  }

  if (record.attempts >= 5) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please request a new OTP." }, { status: 429 });
  }

  const incomingHash = hashOtp(mobile, parsed.data.otp);
  const matches = crypto.timingSafeEqual(Buffer.from(incomingHash), Buffer.from(record.otpHash));

  if (!matches) {
    store.set(mobile, { ...record, attempts: record.attempts + 1 });
    return NextResponse.json({ ok: false, error: "Incorrect OTP." }, { status: 400 });
  }

  store.delete(mobile);
  return NextResponse.json({ ok: true });
}

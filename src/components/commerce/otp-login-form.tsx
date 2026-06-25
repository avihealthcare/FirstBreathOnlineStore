"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { KeyRound, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { otpRequestSchema, otpVerifySchema } from "@/lib/validation";
import { normalizeMobile } from "@/lib/utils";
import { useCustomerStore } from "@/store/customer-store";

type OtpLoginFormProps = {
  onVerified?: () => void;
};

type MobileInput = z.infer<typeof otpRequestSchema>;

export function OtpLoginForm({ onVerified }: OtpLoginFormProps) {
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const loginWithMobile = useCustomerStore((state) => state.loginWithMobile);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<MobileInput>({
    resolver: zodResolver(otpRequestSchema),
    defaultValues: { mobile: "" }
  });

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  async function requestOtp(values: MobileInput) {
    setServerError("");
    const response = await fetch("/api/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const data = (await response.json()) as { ok: boolean; message?: string; debugOtp?: string; error?: string };

    if (!response.ok || !data.ok) {
      setServerError(data.error ?? "Unable to send OTP. Please retry.");
      return;
    }

    setStep("otp");
    setCountdown(30);
    setMessage(`${data.message ?? "OTP sent."}${data.debugOtp ? ` MVP OTP: ${data.debugOtp}` : ""}`);
  }

  async function verifyOtp() {
    setServerError("");
    const mobile = getValues("mobile");
    const parsed = otpVerifySchema.safeParse({ mobile, otp });
    if (!parsed.success) {
      setServerError(parsed.error.errors[0]?.message ?? "Enter a valid OTP.");
      return;
    }

    const response = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data)
    });
    const data = (await response.json()) as { ok: boolean; error?: string };

    if (!response.ok || !data.ok) {
      setServerError(data.error ?? "OTP verification failed.");
      return;
    }

    loginWithMobile(normalizeMobile(mobile));
    onVerified?.();
  }

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-avi-mist text-avi-teal">
          {step === "mobile" ? <Smartphone className="h-5 w-5" /> : <KeyRound className="h-5 w-5" />}
        </span>
        <div>
          <h2 className="text-xl font-black text-avi-ink">Login with mobile number to continue checkout.</h2>
          <p className="mt-1 text-sm text-slate-600">New mobile numbers are signed up automatically after OTP verification.</p>
        </div>
      </div>

      {step === "mobile" ? (
        <form onSubmit={handleSubmit(requestOtp)} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input id="mobile" inputMode="numeric" placeholder="+91 98765 43210" {...register("mobile")} />
            {errors.mobile ? <p className="mt-1 text-xs text-red-600">{errors.mobile.message}</p> : null}
          </div>
          {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Send OTP
          </Button>
        </form>
      ) : (
        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="otp">Enter OTP</Label>
            <Input id="otp" inputMode="numeric" value={otp} maxLength={6} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="123456" />
            {message ? <p className="mt-2 text-xs text-emerald-700">{message}</p> : null}
          </div>
          {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={verifyOtp}>Verify & Continue</Button>
            <Button variant="secondary" onClick={handleSubmit(requestOtp)} disabled={countdown > 0}>
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
            </Button>
          </div>
          <button className="text-sm font-semibold text-avi-teal" onClick={() => setStep("mobile")}>
            Change mobile number
          </button>
        </div>
      )}
    </div>
  );
}

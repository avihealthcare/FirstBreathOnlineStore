"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Building2, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerStore } from "@/store/customer-store";
import type { CustomerProfile } from "@/types";

type CustomerEmailAuthFormProps = {
  mode: "login" | "signup";
  onAuthenticated?: () => void;
};

type AuthResponse = {
  ok: boolean;
  error?: string;
  customer?: CustomerProfile;
};

export function CustomerEmailAuthForm({ mode, onAuthenticated }: CustomerEmailAuthFormProps) {
  const setCustomer = useCustomerStore((state) => state.setCustomer);
  const [fullName, setFullName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [mobile, setMobile] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const response = await fetch(isSignup ? "/api/customer/signup" : "/api/customer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        isSignup
          ? { fullName, hospitalName, mobile, gstNumber, email, password }
          : { email, password }
      )
    });
    const data = (await response.json()) as AuthResponse;
    setLoading(false);

    if (!response.ok || !data.ok || !data.customer) {
      setError(data.error ?? "Unable to continue. Please check the details.");
      return;
    }

    setCustomer(data.customer);
    setMessage(isSignup ? "Account created successfully." : "Logged in successfully.");
    onAuthenticated?.();
  }

  return (
    <section className="rounded-xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-avi-mist text-avi-teal">
          {isSignup ? <UserRound className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}
        </span>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">
            {isSignup ? "Create Account" : "Account Login"}
          </p>
          <h1 className="mt-1 text-2xl font-black text-avi-ink">
            {isSignup ? "Create a hospital purchase account" : "Login with email to continue"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {isSignup
              ? "Your profile, hospital details, addresses, and repeat orders will be saved for future purchases."
              : "Use your registered email and password to access checkout, saved details, and order history."}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {isSignup ? (
          <>
            <AuthField label="Full Name" icon={UserRound}>
              <Input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Dr. Ramesh Kumar" className="pl-9" required />
            </AuthField>
            <AuthField label="Hospital / Company" icon={Building2}>
              <Input value={hospitalName} onChange={(event) => setHospitalName(event.target.value)} placeholder="Sunrise Children's Hospital" className="pl-9" required />
            </AuthField>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="auth-mobile">Mobile</Label>
                <Input id="auth-mobile" value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder="9876543210" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="auth-gst">GST Number</Label>
                <Input id="auth-gst" value={gstNumber} onChange={(event) => setGstNumber(event.target.value)} placeholder="Optional" className="mt-2" />
              </div>
            </div>
          </>
        ) : null}

        <AuthField label="Email" icon={Mail}>
          <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="orders@hospital.com" className="pl-9" required autoComplete="email" />
        </AuthField>
        <AuthField label="Password" icon={LockKeyhole}>
          <Input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 8 characters"
            className="pl-9 pr-11"
            required
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-avi-ink"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        </AuthField>

        {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        {message ? <p className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{message}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
        </Button>
        <Button type="button" variant="secondary" className="w-full" disabled>
          Continue with Google Coming Soon
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        {isSignup ? "Already have an account?" : "New to AVI FirstBreath?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"} className="font-bold text-avi-teal">
          {isSignup ? "Login" : "Create account"}
        </Link>
      </p>
    </section>
  );
}

function AuthField({
  label,
  icon: Icon,
  children
}: {
  label: string;
  icon: typeof Mail;
  children: React.ReactNode;
}) {
  const id = label.toLowerCase().replace(/\W+/g, "-");
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-2">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        {children}
      </div>
    </div>
  );
}

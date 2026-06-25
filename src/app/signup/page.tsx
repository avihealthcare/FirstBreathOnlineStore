import Link from "next/link";
import { Building2, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpLoginForm } from "@/components/commerce/otp-login-form";

export default function SignupPage() {
  return (
    <div className="container grid gap-6 py-10 lg:grid-cols-2 lg:items-start">
      <section className="rounded-xl border border-border bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Create Account</p>
        <h1 className="mt-2 text-3xl font-black text-avi-ink">Signup for Hospital Purchasing</h1>
        <p className="mt-2 text-sm text-slate-600">
          Mobile OTP creates customer accounts automatically. This email signup UI is ready for Auth.js expansion.
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <Label htmlFor="full-name">Full Name</Label>
            <div className="relative mt-2">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="full-name" placeholder="Dr. Ramesh Kumar" className="pl-9" />
            </div>
          </div>
          <div>
            <Label htmlFor="hospital">Hospital / Company</Label>
            <div className="relative mt-2">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="hospital" placeholder="Sunrise Children's Hospital" className="pl-9" />
            </div>
          </div>
          <div>
            <Label htmlFor="signup-email">Email</Label>
            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="signup-email" type="email" placeholder="orders@hospital.com" className="pl-9" />
            </div>
          </div>
          <Button type="button" className="w-full">
            Create Account Placeholder
          </Button>
          <Button type="button" variant="secondary" className="w-full">
            Continue with Google
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-avi-teal">
            Login
          </Link>
        </p>
      </section>

      <OtpLoginForm />
    </div>
  );
}

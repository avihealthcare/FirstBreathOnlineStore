import Link from "next/link";
import { Mail, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpLoginForm } from "@/components/commerce/otp-login-form";

export default function LoginPage() {
  return (
    <div className="container grid gap-6 py-10 lg:grid-cols-2 lg:items-start">
      <section className="rounded-xl border border-border bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Account Login</p>
        <h1 className="mt-2 text-3xl font-black text-avi-ink">Login to AVI FirstBreath Store</h1>
        <p className="mt-2 text-sm text-slate-600">Email login UI is ready for Auth.js activation when credentials are configured.</p>

        <form className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="email" type="email" placeholder="doctor@hospital.com" className="pl-9" />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-2">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="password" type="password" placeholder="••••••••" className="pl-9" />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="h-4 w-4 rounded border-border accent-avi-teal" />
              Remember me
            </label>
            <Link href="#" className="font-semibold text-avi-teal hover:text-avi-tealDark">
              Forgot password?
            </Link>
          </div>
          <Button type="button" className="w-full">
            Login
          </Button>
          <Button type="button" variant="secondary" className="w-full">
            Continue with Google
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          New to AVI FirstBreath?{" "}
          <Link href="/signup" className="font-bold text-avi-teal">
            Create account
          </Link>
        </p>
      </section>

      <OtpLoginForm />
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store"
    });
    const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };

    setLoading(false);
    if (!response.ok || !data.ok) {
      setError(data.error ?? "Unable to login.");
      return;
    }

    window.location.assign("/admin");
  }

  return (
    <form onSubmit={login} className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-avi-mist text-avi-teal">
          <LockKeyhole className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Admin Login</p>
          <h1 className="mt-1 text-2xl font-black text-avi-ink">AVI FirstBreath Admin</h1>
          <p className="mt-2 text-sm text-slate-600">Admin access is hidden from public navigation and protected by email and password.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div>
          <Label htmlFor="admin-email">Admin Email</Label>
          <div className="relative mt-2">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@avihealthcare.com"
              className="pl-9"
              autoComplete="username"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="admin-password">Password</Label>
          <div className="relative mt-2">
            <Input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter admin password"
              className="pr-11"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-avi-ink"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>

      <Button type="submit" className="mt-6 w-full" disabled={loading}>
        {loading ? "Checking..." : "Open Admin Panel"}
      </Button>
      <Button asChild type="button" variant="secondary" className="mt-3 w-full">
        <Link href="/">Back to Store</Link>
      </Button>

      <p className="mt-5 text-xs leading-5 text-slate-500">
        Use the ADMIN user stored in Supabase, or set server-only `ADMIN_EMAIL` and `ADMIN_PASSWORD` on Hostinger.
      </p>
    </form>
  );
}

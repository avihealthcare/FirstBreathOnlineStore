"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessCode })
    });
    const data = (await response.json()) as { ok: boolean; error?: string };

    setLoading(false);
    if (!response.ok || !data.ok) {
      setError(data.error ?? "Unable to login.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-10">
      <form onSubmit={login} className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-avi-mist text-avi-teal">
            <LockKeyhole className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Special Admin Login</p>
            <h1 className="mt-1 text-2xl font-black text-avi-ink">AVI FirstBreath Admin</h1>
            <p className="mt-2 text-sm text-slate-600">Admin access is hidden from public navigation and protected by an access code.</p>
          </div>
        </div>

        <div className="mt-6">
          <Label htmlFor="admin-code">Admin Access Code</Label>
          <Input
            id="admin-code"
            type="password"
            value={accessCode}
            onChange={(event) => setAccessCode(event.target.value)}
            placeholder="Enter admin access code"
            className="mt-2"
            autoComplete="current-password"
          />
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Checking..." : "Open Admin Panel"}
        </Button>
        <Button asChild type="button" variant="secondary" className="mt-3 w-full">
          <Link href="/">Back to Store</Link>
        </Button>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          Local default code: <span className="font-semibold">AVI-FIRSTBREATH-ADMIN</span>. Change `ADMIN_ACCESS_CODE` before deployment.
        </p>
      </form>
    </div>
  );
}

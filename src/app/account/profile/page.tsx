"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { CustomerEmailAuthForm } from "@/components/commerce/customer-email-auth-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerStore } from "@/store/customer-store";
import type { CustomerProfile } from "@/types";

export default function ProfilePage() {
  const customer = useCustomerStore((state) => state.customer);
  const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);
  const setCustomer = useCustomerStore((state) => state.setCustomer);
  const [draft, setDraft] = useState({
    fullName: "",
    email: "",
    mobile: "",
    hospitalName: "",
    gstNumber: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!customer) return;
    setDraft({
      fullName: customer.fullName,
      email: customer.email,
      mobile: customer.mobile,
      hospitalName: customer.hospitalName,
      gstNumber: customer.gstNumber
    });
  }, [customer]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/customer/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    const data = (await response.json()) as { ok: boolean; customer?: CustomerProfile; error?: string };
    setLoading(false);

    if (!response.ok || !data.ok || !data.customer) {
      setError(data.error ?? "Unable to save profile.");
      return;
    }

    setCustomer(data.customer);
    setMessage("Profile saved successfully.");
  }

  if (!isLoggedIn || !customer) {
    return (
      <div className="container max-w-xl py-10">
        <CustomerEmailAuthForm mode="login" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Account</p>
          <h1 className="mt-2 text-3xl font-black text-avi-ink">Profile Details</h1>
        </div>
        <Button asChild variant="secondary">
          <Link href="/account">Back to Account</Link>
        </Button>
      </div>

      <form onSubmit={save} className="grid gap-5 rounded-xl border border-border bg-white p-6 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <ProfileField label="Full Name">
            <Input value={draft.fullName} onChange={(event) => setDraft((current) => ({ ...current, fullName: event.target.value }))} />
          </ProfileField>
          <ProfileField label="Email">
            <Input type="email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} />
          </ProfileField>
          <ProfileField label="Mobile">
            <Input value={draft.mobile} onChange={(event) => setDraft((current) => ({ ...current, mobile: event.target.value }))} />
          </ProfileField>
          <ProfileField label="Hospital / Company">
            <Input value={draft.hospitalName} onChange={(event) => setDraft((current) => ({ ...current, hospitalName: event.target.value }))} />
          </ProfileField>
          <ProfileField label="GST Number">
            <Input value={draft.gstNumber} onChange={(event) => setDraft((current) => ({ ...current, gstNumber: event.target.value }))} />
          </ProfileField>
        </div>

        {message ? <p className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

        <Button type="submit" className="w-fit" disabled={loading}>
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}

function ProfileField({ label, children }: { label: string; children: React.ReactNode }) {
  const id = label.toLowerCase().replace(/\W+/g, "-");
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

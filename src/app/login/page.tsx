import type { Metadata } from "next";
import { CustomerEmailAuthForm } from "@/components/commerce/customer-email-auth-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to AVI FirstBreath Store with email and password."
};

export default function LoginPage() {
  return (
    <div className="container grid gap-6 py-10 lg:grid-cols-[minmax(0,520px)_1fr] lg:items-start">
      <CustomerEmailAuthForm mode="login" />
      <section className="rounded-xl border border-border bg-avi-mist p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Hospital Account</p>
        <h2 className="mt-2 text-2xl font-black text-avi-ink">Saved details for repeat NICU procurement</h2>
        <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
          <p>Access saved hospital details, GST information, shipping addresses, previous orders, and invoice placeholders.</p>
          <p>Checkout requires login only when you proceed from cart, so browsing and product comparison stay open.</p>
        </div>
      </section>
    </div>
  );
}

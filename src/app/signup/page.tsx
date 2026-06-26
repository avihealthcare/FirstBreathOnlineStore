import type { Metadata } from "next";
import { CustomerEmailAuthForm } from "@/components/commerce/customer-email-auth-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create an AVI FirstBreath Store customer account for hospital purchasing."
};

export default function SignupPage() {
  return (
    <div className="container grid gap-6 py-10 lg:grid-cols-[minmax(0,560px)_1fr] lg:items-start">
      <CustomerEmailAuthForm mode="signup" />
      <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Professional Procurement</p>
        <h2 className="mt-2 text-2xl font-black text-avi-ink">Create once, order faster later</h2>
        <ul className="mt-5 grid gap-3 text-sm leading-6 text-slate-700">
          <li>Saved hospital/company details and GST number.</li>
          <li>Saved shipping addresses for repeat dispatches.</li>
          <li>Order history, repeat order support, and invoice placeholders.</li>
        </ul>
      </section>
    </div>
  );
}

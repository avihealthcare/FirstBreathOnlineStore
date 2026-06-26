"use client";

import { FormEvent, useState } from "react";
import { FileText, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/types";

type ProductEnquiryActionsProps = {
  product: Product;
  variant?: string;
  quantity?: number;
  compact?: boolean;
};

type QuoteResponse = {
  ok: boolean;
  error?: string;
  leadNumber?: string;
  responseTime?: string;
};

type WhatsAppResponse = {
  ok: boolean;
  error?: string;
  leadNumber?: string;
  whatsappUrl?: string;
};

const purchaseTypes = ["Hospital", "Distributor", "Dealer", "Government Tender", "Others"];

export function ProductEnquiryActions({ product, variant, quantity = 1, compact = false }: ProductEnquiryActionsProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const selectedVariant = variant || product.variants[0] ? variant || `${product.variants[0]?.name}: ${product.variants[0]?.value}` : "";

  return (
    <>
      <div className={compact ? "grid grid-cols-2 gap-2" : "grid gap-3 sm:grid-cols-2"}>
        <Button type="button" variant="outline" size={compact ? "sm" : "md"} onClick={() => setQuoteOpen(true)} className={compact ? "text-xs" : ""}>
          <FileText className="h-4 w-4" aria-hidden="true" />
          {compact ? "Bulk Quote" : "Request Bulk Quote"}
        </Button>
        <Button type="button" variant="secondary" size={compact ? "sm" : "md"} onClick={() => setWhatsappOpen(true)} className={compact ? "text-xs" : ""}>
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp
        </Button>
      </div>

      {quoteOpen ? (
        <QuoteModal
          product={product}
          variant={selectedVariant}
          defaultQuantity={quantity}
          onClose={() => setQuoteOpen(false)}
        />
      ) : null}
      {whatsappOpen ? (
        <WhatsAppModal
          product={product}
          variant={selectedVariant}
          defaultQuantity={quantity}
          onClose={() => setWhatsappOpen(false)}
        />
      ) : null}
    </>
  );
}

function ModalShell({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-end bg-avi-ink/45 p-0 sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-avi-teal">AVI FirstBreath Store</p>
            <h2 className="mt-1 text-xl font-black text-avi-ink">{title}</h2>
          </div>
          <button type="button" aria-label="Close popup" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-slate-50" onClick={onClose}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function QuoteModal({
  product,
  variant,
  defaultQuantity,
  onClose
}: {
  product: Product;
  variant: string;
  defaultQuantity: number;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const form = new FormData(event.currentTarget);

    const payload = {
      productId: product.id,
      productName: product.name,
      variant,
      name: String(form.get("name") ?? ""),
      mobile: String(form.get("mobile") ?? ""),
      email: String(form.get("email") ?? ""),
      companyName: String(form.get("companyName") ?? ""),
      cityState: String(form.get("cityState") ?? ""),
      estimatedQuantity: Number(form.get("estimatedQuantity") ?? 0),
      purchaseType: String(form.get("purchaseType") ?? ""),
      expectedTimeline: String(form.get("expectedTimeline") ?? ""),
      additionalRequirements: String(form.get("additionalRequirements") ?? ""),
      fileName: form.get("file") instanceof File ? (form.get("file") as File).name : ""
    };

    const response = await fetch("/api/leads/bulk-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = (await response.json().catch(() => ({}))) as QuoteResponse;
    setLoading(false);

    if (!response.ok || !data.ok) {
      setStatus({ type: "error", text: data.error ?? "Unable to submit quote request." });
      return;
    }

    setStatus({
      type: "success",
      text: `Quote Request ID ${data.leadNumber}. ${data.responseTime ?? "Our sales team will respond within 1 working day."}`
    });
  }

  return (
    <ModalShell title="Request Bulk Quote" onClose={onClose}>
      <form onSubmit={submit} className="mt-5 grid gap-4">
        <div className="grid gap-3 rounded-xl bg-avi-mist p-4 text-sm">
          <p><span className="font-bold text-avi-ink">Product:</span> {product.name}</p>
          <p><span className="font-bold text-avi-ink">Variant:</span> {variant || "Standard"}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Name" name="name" required />
          <FormField label="Mobile Number" name="mobile" required placeholder="9876543210" />
          <FormField label="Email" name="email" type="email" required />
          <FormField label="Company / Hospital Name" name="companyName" required />
          <FormField label="City & State" name="cityState" placeholder="Mumbai, Maharashtra" />
          <FormField label="Estimated Quantity" name="estimatedQuantity" type="number" required defaultValue={String(defaultQuantity)} />
          <div>
            <Label htmlFor="purchaseType">Purchase Type</Label>
            <select id="purchaseType" name="purchaseType" required className="mt-2 h-11 w-full rounded-lg border border-input bg-white px-3 text-sm">
              {purchaseTypes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <FormField label="Expected Purchase Timeline" name="expectedTimeline" placeholder="This week / This month" />
        </div>
        <div>
          <Label htmlFor="additionalRequirements">Additional Requirements</Label>
          <Textarea id="additionalRequirements" name="additionalRequirements" className="mt-2" placeholder="Compatibility, tender specs, pack size, delivery location..." />
        </div>
        <div>
          <Label htmlFor="file">Optional File Upload</Label>
          <Input id="file" name="file" type="file" className="mt-2" />
          <p className="mt-2 text-xs text-slate-500">MVP stores the filename. Cloud storage can be connected later for PO/tender uploads.</p>
        </div>
        {status ? (
          <p className={`rounded-lg p-3 text-sm font-semibold ${status.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {status.text}
          </p>
        ) : null}
        <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Quote Request"}</Button>
      </form>
    </ModalShell>
  );
}

function WhatsAppModal({
  product,
  variant,
  defaultQuantity,
  onClose
}: {
  product: Product;
  variant: string;
  defaultQuantity: number;
  onClose: () => void;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/leads/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        productName: product.name,
        variant,
        name: String(form.get("name") ?? ""),
        mobile: String(form.get("mobile") ?? ""),
        companyName: String(form.get("companyName") ?? ""),
        quantity: Number(form.get("quantity") ?? 0)
      })
    });
    const data = (await response.json().catch(() => ({}))) as WhatsAppResponse;
    setLoading(false);

    if (!response.ok || !data.ok || !data.whatsappUrl) {
      setError(data.error ?? "Unable to continue to WhatsApp.");
      return;
    }

    window.location.href = data.whatsappUrl;
  }

  return (
    <ModalShell title="WhatsApp Enquiry" onClose={onClose}>
      <form onSubmit={submit} className="mt-5 grid gap-4">
        <div className="grid gap-3 rounded-xl bg-avi-mist p-4 text-sm">
          <p><span className="font-bold text-avi-ink">Product:</span> {product.name}</p>
          <p><span className="font-bold text-avi-ink">Variant:</span> {variant || "Standard"}</p>
        </div>
        <FormField label="Name" name="name" required />
        <FormField label="Mobile Number" name="mobile" required placeholder="9876543210" />
        <FormField label="Company / Hospital Name" name="companyName" />
        <FormField label="Quantity Required" name="quantity" type="number" required defaultValue={String(defaultQuantity)} />
        {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {loading ? "Preparing..." : "Continue to WhatsApp"}
        </Button>
      </form>
    </ModalShell>
  );
}

function FormField({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  defaultValue
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} className="mt-2" />
    </div>
  );
}

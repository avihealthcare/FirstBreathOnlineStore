import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";

const policies = {
  privacy: {
    title: "Privacy Policy",
    description:
      "Customer and order data should be handled according to privacy and data protection best practices. Real production deployment should include finalized legal language, consent handling, and access controls.",
    points: [
      "Collect only the customer, hospital, GST, shipping, and order information required for fulfilment.",
      "Do not expose service-role keys, password/session secrets, payment credentials, or private customer data to the browser.",
      "Restrict admin access before production launch and audit customer data workflows."
    ]
  },
  terms: {
    title: "Terms and Conditions",
    description:
      "This store supports ecommerce orders and purchase enquiries for professional healthcare procurement. Final commercial terms should be reviewed by AVI Healthcare Pvt Ltd.",
    points: [
      "Product images are representative and may vary by batch or supplier.",
      "Specifications, compatibility, and availability should be confirmed before clinical use or bulk purchase.",
      "This website does not provide medical advice."
    ]
  },
  shipping: {
    title: "Shipping Policy",
    description:
      "Shipping timelines depend on stock, destination, order size, and confirmation of procurement details.",
    points: [
      "Fast-dispatch products can be processed after order or enquiry confirmation.",
      "Bulk institutional orders may require additional availability confirmation.",
      "Shipping charges shown in the MVP are placeholders and can be replaced with logistics rules."
    ]
  },
  returns: {
    title: "Return Policy",
    description:
      "Returns for medical consumables should account for sterility, batch traceability, packaging condition, and procurement terms.",
    points: [
      "Opened, used, or clinically deployed disposable items may not be returnable.",
      "Return eligibility should be verified by AVI Healthcare support before shipping items back.",
      "Batch, invoice, and order details may be required for support."
    ]
  }
};

type PolicyPageProps = {
  params: Promise<{ slug: keyof typeof policies }>;
};

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = policies[slug];
  return {
    title: policy?.title ?? "Policy",
    description: policy?.description
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = policies[slug];

  if (!policy) notFound();

  return (
    <div className="container max-w-3xl py-10">
      <Link href="/" className="text-sm font-bold text-avi-teal hover:text-avi-tealDark">
        Back to store
      </Link>
      <article className="mt-5 rounded-xl border border-border bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-black text-avi-ink">{policy.title}</h1>
        <p className="mt-4 leading-7 text-slate-700">{policy.description}</p>
        <div className="mt-6 grid gap-3">
          {policy.points.map((point) => (
            <p key={point} className="flex gap-3 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-avi-teal" aria-hidden="true" />
              {point}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}

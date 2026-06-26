import type { Metadata } from "next";
import { CheckoutForm } from "@/components/commerce/checkout-form";
import { getCurrentCustomer, mapCustomerProfile } from "@/lib/customer-auth";
import { getDiscountCoupons, getPaymentOptions } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Email-login protected checkout for AVI FirstBreath Store orders and purchase enquiries."
};

export default async function CheckoutPage() {
  const [paymentOptions, coupons, customer] = await Promise.all([
    getPaymentOptions(),
    getDiscountCoupons(),
    getCurrentCustomer()
  ]);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Secure Checkout</p>
        <h1 className="mt-2 text-3xl font-black text-avi-ink">Order / Purchase Enquiry</h1>
      </div>
      <CheckoutForm
        initialPaymentOptions={paymentOptions}
        initialCoupons={coupons}
        initialCustomer={customer ? mapCustomerProfile(customer) : null}
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, FileText, LockKeyhole, RefreshCcw, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateCartTotals, formatCurrency } from "@/lib/utils";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation";
import { useCartStore } from "@/store/cart-store";
import { useCustomerStore } from "@/store/customer-store";
import { calculateCouponDiscount, useAdminStore } from "@/store/admin-store";
import { OtpLoginForm } from "@/components/commerce/otp-login-form";
import type { CustomerOrder } from "@/types";

const defaultValues: CheckoutInput = {
  fullName: "",
  email: "",
  mobile: "",
  hospitalName: "",
  gstNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  purchaseType: "Hospital Purchase",
  paymentMethod: "purchase-order"
};

export function CheckoutForm() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const customer = useCustomerStore((state) => state.customer);
  const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);
  const updateProfile = useCustomerStore((state) => state.updateProfile);
  const addOrder = useCustomerStore((state) => state.addOrder);
  const paymentOptions = useAdminStore((state) => state.paymentOptions);
  const coupons = useAdminStore((state) => state.coupons);
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponId, setAppliedCouponId] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const totals = useMemo(() => calculateCartTotals(items), [items]);
  const activePaymentOptions = useMemo(() => paymentOptions.filter((option) => option.isActive), [paymentOptions]);
  const appliedCoupon = coupons.find((coupon) => coupon.id === appliedCouponId);
  const discount = useMemo(() => calculateCouponDiscount(appliedCoupon, totals.subtotal), [appliedCoupon, totals.subtotal]);
  const grandTotal = Math.max(0, totals.total - discount);
  const defaultAddress = customer?.addresses.find((address) => address.isDefault) ?? customer?.addresses[0];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues
  });

  useEffect(() => {
    if (!customer) return;
    reset({
      fullName: customer.fullName,
      email: customer.email,
      mobile: customer.mobile,
      hospitalName: customer.hospitalName,
      gstNumber: customer.gstNumber,
      addressLine1: defaultAddress?.addressLine1 ?? "",
      addressLine2: defaultAddress?.addressLine2 ?? "",
      city: defaultAddress?.city ?? "",
      state: defaultAddress?.state ?? "",
      pincode: defaultAddress?.pincode ?? "",
      country: defaultAddress?.country ?? "India",
      purchaseType: "Hospital Purchase",
      paymentMethod: activePaymentOptions[0]?.id ?? "purchase-order"
    });
  }, [activePaymentOptions, customer, defaultAddress, reset]);

  function selectAddress(id: string) {
    const address = customer?.addresses.find((item) => item.id === id);
    if (!address) return;
    setValue("addressLine1", address.addressLine1);
    setValue("addressLine2", address.addressLine2 ?? "");
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("pincode", address.pincode);
    setValue("country", address.country);
  }

  function submitOrder(values: CheckoutInput) {
    const selectedPayment = activePaymentOptions.find((option) => option.id === values.paymentMethod);
    updateProfile({
      fullName: values.fullName,
      email: values.email,
      mobile: values.mobile,
      hospitalName: values.hospitalName,
      gstNumber: values.gstNumber
    });

    const order = addOrder({
      status: "Pending",
      paymentMethod: selectedPayment?.label ?? values.paymentMethod,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      total: grandTotal,
      items: items.map((item) => ({
        productSlug: item.productSlug,
        productName: item.name,
        sku: item.sku,
        variant: item.variant,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity
      }))
    });

    clearCart();
    setConfirmedOrder(order);
  }

  function applyCoupon() {
    const normalizedCode = couponCode.trim().toUpperCase();
    const coupon = coupons.find((item) => item.code === normalizedCode && item.isActive);

    if (!coupon) {
      setAppliedCouponId("");
      setCouponMessage("Coupon is invalid or inactive.");
      return;
    }

    if (totals.subtotal < coupon.minOrderValue) {
      setAppliedCouponId("");
      setCouponMessage(`Minimum order value for ${coupon.code} is ${formatCurrency(coupon.minOrderValue)}.`);
      return;
    }

    setAppliedCouponId(coupon.id);
    setCouponMessage(`${coupon.code} applied. Discount: ${formatCurrency(calculateCouponDiscount(coupon, totals.subtotal))}`);
  }

  if (confirmedOrder) {
    return (
      <section className="mx-auto max-w-xl rounded-xl border border-border bg-white p-8 text-center shadow-soft">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" aria-hidden="true" />
        <h1 className="mt-5 text-3xl font-black text-avi-ink">Thank You!</h1>
        <p className="mt-2 text-slate-600">Your order has been placed successfully.</p>
        <div className="mt-6 rounded-lg bg-avi-mist p-4">
          <p className="text-sm text-slate-600">Order ID</p>
          <p className="mt-1 font-black text-avi-ink">{confirmedOrder.orderNumber}</p>
          <p className="mt-2 text-sm text-slate-600">We will review your order and update you soon.</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button asChild>
            <Link href="/account/orders">View My Orders</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add neonatal consumables to cart before continuing to checkout or submitting a bulk enquiry."
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto max-w-xl">
        <OtpLoginForm />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submitOrder)} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-avi-teal text-sm font-bold text-white">1</span>
            <div>
              <h1 className="text-xl font-black text-avi-ink">Customer & Hospital Details</h1>
              <p className="text-sm text-slate-600">Returning customers can edit saved details before placing the order.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Full Name" error={errors.fullName?.message}>
              <Input {...register("fullName")} />
            </Field>
            <Field label="Mobile Number" error={errors.mobile?.message}>
              <Input inputMode="numeric" {...register("mobile")} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <Input type="email" {...register("email")} />
            </Field>
            <Field label="Hospital / Company Name" error={errors.hospitalName?.message}>
              <Input {...register("hospitalName")} />
            </Field>
            <Field label="GST Number" error={errors.gstNumber?.message}>
              <Input {...register("gstNumber")} />
            </Field>
            <Field label="Purchase Type" error={errors.purchaseType?.message}>
              <select
                className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-avi-teal focus:outline-none focus:ring-2 focus:ring-avi-teal/20"
                {...register("purchaseType")}
              >
                <option>Hospital Purchase</option>
                <option>Individual Purchase</option>
                <option>Dealer Purchase</option>
              </select>
            </Field>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-avi-teal text-sm font-bold text-white">2</span>
            <div>
              <h2 className="text-xl font-black text-avi-ink">Shipping Address</h2>
              <p className="text-sm text-slate-600">Saved address support is included for repeat purchases.</p>
            </div>
          </div>

          {customer?.addresses.length ? (
            <div className="mt-5">
              <Label htmlFor="saved-address">Select Saved Address</Label>
              <select
                id="saved-address"
                className="mt-2 h-11 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-avi-teal focus:outline-none focus:ring-2 focus:ring-avi-teal/20"
                onChange={(event) => selectAddress(event.target.value)}
                defaultValue={defaultAddress?.id}
              >
                {customer.addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.addressLine1}, {address.city} {address.isDefault ? "(Default)" : ""}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Address Line 1" error={errors.addressLine1?.message}>
              <Input {...register("addressLine1")} />
            </Field>
            <Field label="Address Line 2" error={errors.addressLine2?.message}>
              <Input {...register("addressLine2")} />
            </Field>
            <Field label="City" error={errors.city?.message}>
              <Input {...register("city")} />
            </Field>
            <Field label="State" error={errors.state?.message}>
              <Input {...register("state")} />
            </Field>
            <Field label="Pincode" error={errors.pincode?.message}>
              <Input inputMode="numeric" {...register("pincode")} />
            </Field>
            <Field label="Country" error={errors.country?.message}>
              <Input {...register("country")} />
            </Field>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-avi-teal text-sm font-bold text-white">3</span>
            <div>
              <h2 className="text-xl font-black text-avi-ink">Payment Method</h2>
              <p className="text-sm text-slate-600">Payment options and bank details can be managed from the admin panel.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {activePaymentOptions.map((option) => (
              <label key={option.id} className="flex gap-3 rounded-lg border border-border p-4 text-sm transition hover:border-avi-teal">
                <input type="radio" value={option.id} className="mt-1 h-4 w-4 accent-avi-teal" {...register("paymentMethod")} />
                <span>
                  <span className="block font-bold text-avi-ink">{option.label}</span>
                  <span className="mt-1 block text-slate-600">{option.description}</span>
                  {option.bankName ? (
                    <span className="mt-3 block rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                      <strong className="text-avi-ink">Bank details:</strong> {option.bankName}, {option.accountName}, A/C{" "}
                      {option.accountNumber}, IFSC {option.ifsc}
                      {option.instructions ? <span className="block">{option.instructions}</span> : null}
                    </span>
                  ) : null}
                </span>
              </label>
            ))}
            {!activePaymentOptions.length ? (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">No payment options are active. Enable at least one in admin.</p>
            ) : null}
          </div>
        </div>
      </section>

      <aside className="h-fit rounded-xl border border-border bg-white p-5 shadow-soft lg:sticky lg:top-28">
        <h2 className="text-lg font-black text-avi-ink">Order Summary</h2>
        <div className="mt-4 max-h-64 space-y-3 overflow-auto pr-1">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-3 text-sm">
              <div>
                <p className="font-semibold text-avi-ink">{item.name}</p>
                <p className="text-xs text-slate-500">
                  {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
              <p className="font-semibold text-avi-ink">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Tax</span>
            <span className="font-semibold">{formatCurrency(totals.tax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Shipping</span>
            <span className="font-semibold">{totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}</span>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <Label htmlFor="coupon-code" className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-avi-teal" />
              Discount Coupon
            </Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
              <Input
                id="coupon-code"
                value={couponCode}
                onChange={(event) => {
                  setCouponCode(event.target.value.toUpperCase());
                  setCouponMessage("");
                }}
                placeholder="FIRSTBREATH5"
              />
              <Button type="button" variant="secondary" onClick={applyCoupon}>
                Apply
              </Button>
            </div>
            {couponMessage ? (
              <p className={discount > 0 ? "mt-2 text-xs font-semibold text-emerald-700" : "mt-2 text-xs font-semibold text-red-600"}>
                {couponMessage}
              </p>
            ) : null}
          </div>
          {discount > 0 ? (
            <div className="flex justify-between text-emerald-700">
              <span>Coupon Discount</span>
              <span className="font-semibold">- {formatCurrency(discount)}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-border pt-3 text-base font-black text-avi-ink">
            <span>Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-2 rounded-lg bg-avi-mist p-3 text-xs text-slate-700">
          <span className="inline-flex gap-2">
            <LockKeyhole className="h-4 w-4 text-avi-teal" aria-hidden="true" />
            Customer and order data should follow privacy best practices.
          </span>
          <span className="inline-flex gap-2">
            <FileText className="h-4 w-4 text-avi-teal" aria-hidden="true" />
            Invoice download placeholder is available in account orders.
          </span>
          <span className="inline-flex gap-2">
            <RefreshCcw className="h-4 w-4 text-avi-teal" aria-hidden="true" />
            Repeat order is available from order history.
          </span>
        </div>

        <Button type="submit" className="mt-5 w-full" disabled={isSubmitting || activePaymentOptions.length === 0}>
          Place Order / Submit Enquiry
        </Button>
      </aside>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const id = label.toLowerCase().replace(/\W+/g, "-");
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

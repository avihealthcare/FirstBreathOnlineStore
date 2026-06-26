"use client";

import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomerEmailAuthForm } from "@/components/commerce/customer-email-auth-form";
import { useCustomerStore } from "@/store/customer-store";

export default function AddressesPage() {
  const isLoggedIn = useCustomerStore((state) => state.isLoggedIn);
  const customer = useCustomerStore((state) => state.customer);
  const addAddress = useCustomerStore((state) => state.addAddress);
  const updateAddress = useCustomerStore((state) => state.updateAddress);

  if (!isLoggedIn || !customer) {
    return (
      <div className="container max-w-xl py-10">
        <CustomerEmailAuthForm mode="login" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-avi-teal">Account</p>
          <h1 className="mt-2 text-3xl font-black text-avi-ink">Saved Addresses</h1>
        </div>
        <Button
          onClick={() =>
            addAddress({
              addressLine1: "New Hospital Address",
              addressLine2: "Edit details after database connection",
              city: "Mumbai",
              state: "Maharashtra",
              pincode: "400001",
              country: "India",
              isDefault: false
            })
          }
        >
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {customer.addresses.map((address) => (
          <article key={address.id} className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <MapPin className="h-6 w-6 text-avi-teal" aria-hidden="true" />
              {address.isDefault ? <Badge>Default</Badge> : null}
            </div>
            <h2 className="mt-4 font-black text-avi-ink">{address.addressLine1}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {address.addressLine2 ? `${address.addressLine2}, ` : ""}
              {address.city}, {address.state} - {address.pincode}, {address.country}
            </p>
            <div className="mt-5 flex gap-3">
              <Button variant="secondary" onClick={() => updateAddress(address.id, { isDefault: true })}>
                Set Default
              </Button>
              <Button variant="ghost" onClick={() => updateAddress(address.id, { addressLine2: "Updated address placeholder" })}>
                Edit
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

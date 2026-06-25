import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/admin/admin-panel";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Manage AVI FirstBreath Store products, SEO, orders, banners, testimonials, and settings."
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="container py-8">
      <AdminPanel />
    </div>
  );
}

import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/admin/admin-panel";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminInitialData } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Manage AVI FirstBreath Store products, SEO, orders, banners, testimonials, and settings."
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  noStore();

  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const initialData = await getAdminInitialData();

  return (
    <div className="container py-8">
      <AdminPanel initialData={initialData} />
    </div>
  );
}

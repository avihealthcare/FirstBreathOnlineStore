import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Email and password protected admin login for AVI FirstBreath Store."
};

export default function AdminLoginPage() {
  noStore();

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-10">
      <AdminLoginForm />
    </div>
  );
}

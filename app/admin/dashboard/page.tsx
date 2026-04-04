import type { Metadata } from "next";
import { AdminAuthProvider } from "@/components/admin/auth-provider";
import { AdminDashboard } from "@/components/admin/dashboard";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Create, edit, and delete SEO-focused blogs.",
  robots: { index: false, follow: false },
  alternates: { canonical: absoluteUrl("/admin/dashboard") }
};

export default function AdminDashboardPage() {
  return (
    <AdminAuthProvider>
      <AdminDashboard />
    </AdminAuthProvider>
  );
}

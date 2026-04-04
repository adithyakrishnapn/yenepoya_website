import type { Metadata } from "next";
import { AdminAuthProvider } from "@/components/admin/auth-provider";
import { AdminLoginForm } from "@/components/admin/login-form";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Secure admin login for Yenepoya admissions blog management.",
  robots: { index: false, follow: false },
  alternates: { canonical: absoluteUrl("/admin/login") }
};

export default function AdminLoginPage() {
  return (
    <section className="section" style={{ paddingTop: "3.5rem" }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="card card-pad" style={{ display: "grid", gap: "1rem" }}>
          <span className="kicker">Admin access</span>
          <h1 className="section-title" style={{ margin: 0, fontSize: "2.2rem" }}>Sign in</h1>
          <p style={{ margin: 0, color: "var(--text-soft)" }}>Use your Firebase Email/Password admin account.</p>
          <AdminAuthProvider>
            <AdminLoginForm />
          </AdminAuthProvider>
        </div>
      </div>
    </section>
  );
}

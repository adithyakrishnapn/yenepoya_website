"use client";

import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/auth-provider";

export function AdminLoginForm() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid" style={{ gap: "0.9rem" }}>
      <label className="grid" style={{ gap: 6 }}>
        <span>Email</span>
        <input required type="email" placeholder="admin@yenepoya.edu.in" value={email} onChange={(e) => setEmail(e.target.value)} style={fieldStyle} />
      </label>
      <label className="grid" style={{ gap: 6 }}>
        <span>Password</span>
        <input required type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} style={fieldStyle} />
      </label>
      {error ? <p style={{ margin: 0, color: "#b42318" }}>{error}</p> : null}
      <button className="button button-primary" type="submit" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

const fieldStyle: CSSProperties = {
  width: "100%",
  borderRadius: 16,
  border: "1px solid rgba(19,34,56,0.12)",
  background: "rgba(255,255,255,0.9)",
  padding: "0.9rem 1rem",
  color: "var(--text)"
};

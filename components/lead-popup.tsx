"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { recordPerformanceEvent } from "@/lib/performance";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_COUNSELLOR_NUMBER ?? "9686267744";

export function LeadPopup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const pathname = usePathname();

  const blogLabel = useMemo(() => {
    if (!pathname || pathname === "/blog") {
      return "Blog index";
    }

    const slug = pathname.split("/").filter(Boolean).pop() ?? "blog";
    return slug.replace(/-/g, " ");
  }, [pathname]);

  useEffect(() => {
    if (!localStorage.getItem("hasSeenLeadPopup")) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!pathname || !pathname.startsWith("/blog")) {
      return;
    }

    const storageKey = `blog-visit-tracked:${pathname}`;
    if (localStorage.getItem(storageKey)) {
      return;
    }

    localStorage.setItem(storageKey, "true");

    void recordPerformanceEvent({
      kind: "visit",
      source: "Blog visit",
      blogSlug: pathname === "/blog" ? "index" : pathname.split("/").filter(Boolean).pop(),
      blogTitle: blogLabel,
      path: pathname,
      referrer: document.referrer || "Direct"
    });
  }, [blogLabel, pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: `Blog details popup - ${blogLabel}`,
          name,
          username: name,
          phone,
          message: `Requested WhatsApp details from ${blogLabel}`
        })
      });

      const data = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok) {
        setError(data.error ?? "Failed to send enquiry");
        return;
      }

      await recordPerformanceEvent({
        kind: "lead",
        source: `Blog details popup - ${blogLabel}`,
        name,
        phone,
        blogTitle: blogLabel,
        path: pathname || "/blog",
        message: `Requested WhatsApp details from ${blogLabel}`
      });

      const whatsappText = encodeURIComponent(`Hello, I would like details about ${blogLabel}.\nName: ${name}\nWhatsApp: ${phone}`);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${whatsappText}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setMessage("Thank you. Opening WhatsApp now.");
      localStorage.setItem("hasSeenLeadPopup", "true");
      setTimeout(() => setShow(false), 1400);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Failed to send enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(7, 24, 36, 0.66)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f8fcff 100%)",
          width: "min(560px, 94vw)",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "22px",
          border: "1px solid rgba(15, 76, 129, 0.16)",
          boxShadow: "0 28px 64px rgba(8, 35, 57, 0.24)",
          position: "relative"
        }}
      >
        <button
          type="button"
          aria-label="Close popup"
          onClick={() => { localStorage.setItem("hasSeenLeadPopup", "true"); setShow(false); }}
          style={{
            position: "absolute",
            top: "0.9rem",
            right: "0.9rem",
            width: "2rem",
            height: "2rem",
            borderRadius: "999px",
            border: "1px solid rgba(15, 76, 129, 0.18)",
            background: "rgba(255,255,255,0.96)",
            color: "var(--primary)",
            cursor: "pointer",
            fontSize: "1.15rem",
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ×
        </button>

        <div
          style={{
            padding: "1.4rem 1.4rem 1rem",
            borderBottom: "1px solid rgba(15, 76, 129, 0.1)",
            background: "linear-gradient(135deg, rgba(21, 101, 160, 0.12) 0%, rgba(0, 167, 204, 0.09) 100%)"
          }}
        >
          <p style={{ margin: 0, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "var(--primary)" }}>
            Get Details on WhatsApp
          </p>
          <h2 style={{ fontSize: "1.45rem", color: "var(--primary)", margin: "0.25rem 0 0.35rem", lineHeight: 1.2 }}>
            Need course details for {blogLabel}?
          </h2>
          <p className="text-soft" style={{ margin: 0, fontSize: "0.9rem" }}>
            Leave your WhatsApp number and our counsellor will reach out with the right information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" style={{ padding: "1.2rem 1.4rem 1.4rem" }}>
          <div>
            <label className="form-label" style={{ textAlign: "left", display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>Full Name</label>
            <input type="text" required className="input" style={{ padding: "0.5rem" }} placeholder="Enter Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="form-label" style={{ textAlign: "left", display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>WhatsApp Number</label>
            <input type="tel" required className="input" style={{ padding: "0.5rem" }} placeholder="Enter WhatsApp number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))} />
          </div>
          {error ? <p style={{ margin: 0, color: "#b42318", fontSize: "0.9rem" }}>{error}</p> : null}
          {message ? <p style={{ margin: 0, color: "var(--primary)", fontSize: "0.9rem" }}>{message}</p> : null}
          <button
            type="submit"
            className="button button-primary mt-2"
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              borderRadius: "12px",
              border: "none",
              fontWeight: 700,
              background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
              color: "#fff",
              boxShadow: "0 10px 24px rgba(15, 76, 129, 0.24)"
            }}
          >
            {submitting ? "Sending..." : "Get Details on WhatsApp"}
          </button>
        </form>
      </div>
    </div>
  );
}

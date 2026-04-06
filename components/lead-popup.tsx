"use client";
import React, { useState, useEffect } from "react";

export function LeadPopup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Only show if they haven't seen it
    if (!localStorage.getItem("hasSeenLeadPopup")) {
      // Show after a tiny delay so it feels like a popup
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

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
          source: "First visit popup enquiry",
          name,
          username: name,
          email,
          phone,
          course
        })
      });

      const data = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok) {
        setError(data.error ?? "Failed to send enquiry");
        return;
      }

      setMessage("Thank you! Our admissions team will contact you shortly.");
      localStorage.setItem("hasSeenLeadPopup", "true");
      setTimeout(() => setShow(false), 1600);
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
            Admissions Assistance
          </p>
          <h2 style={{ fontSize: "1.45rem", color: "var(--primary)", margin: "0.25rem 0 0.35rem", lineHeight: 1.2 }}>
            Welcome to Yenepoya
          </h2>
          <p className="text-soft" style={{ margin: 0, fontSize: "0.9rem" }}>
            Share your details and our counselor will contact you with course and admission guidance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" style={{ padding: "1.2rem 1.4rem 1.4rem" }}>
          <div>
            <label className="form-label" style={{ textAlign: "left", display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>Full Name</label>
            <input type="text" required className="input" style={{ padding: "0.5rem" }} placeholder="Enter Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="form-label" style={{ textAlign: "left", display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>Email Address</label>
            <input type="email" required className="input" style={{ padding: "0.5rem" }} placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="form-label" style={{ textAlign: "left", display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>Phone Number</label>
            <input type="tel" required className="input" style={{ padding: "0.5rem" }} placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="form-label" style={{ textAlign: "left", display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>Course</label>
            <select required className="input" style={{ padding: "0.5rem" }} value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="" disabled>Select your course</option>
              <option value="BCA Artificial Intelligence & DevOps">BCA Artificial Intelligence & DevOps</option>
              <option value="BCA Cyber Security">BCA Cyber Security</option>
              <option value="BCA Data Science">BCA Data Science</option>
              <option value="BBA Aviation & Logistics">BBA Aviation & Logistics</option>
              <option value="BBA Finance">BBA Finance</option>
              <option value="MBA">MBA</option>
            </select>
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
            {submitting ? "Sending..." : "Submit Details"}
          </button>
        </form>
      </div>
    </div>
  );
}

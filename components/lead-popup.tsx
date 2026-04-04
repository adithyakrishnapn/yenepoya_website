"use client";
import React, { useState, useEffect } from "react";

export function LeadPopup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
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
        body: JSON.stringify({ name, username, email, phone, course })
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
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div className="card" style={{ background: "white", width: "100%", maxWidth: "450px", position: "relative" }}>
        
        <button 
          onClick={() => { localStorage.setItem("hasSeenLeadPopup", "true"); setShow(false); }}
          style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem" }}
        >
          ×
        </button>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", color: "var(--primary)", marginBottom: "0.25rem" }}>Welcome to Yenepoya</h2>
          <p className="text-soft" style={{ fontSize: "0.9rem" }}>Share your details to get course guidance and admissions support.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="form-label" style={{ textAlign: "left", display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>Full Name</label>
            <input type="text" required className="input" style={{ padding: "0.5rem" }} placeholder="Enter Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="form-label" style={{ textAlign: "left", display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>Username</label>
            <input type="text" required className="input" style={{ padding: "0.5rem" }} placeholder="Choose a Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="form-label" style={{ textAlign: "left", display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>Email Address</label>
            <input type="email" required className="input" style={{ padding: "0.5rem" }} placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="form-label" style={{ textAlign: "left", display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>Phone Number</label>
            <input type="tel" required className="input" style={{ padding: "0.5rem" }} placeholder="+91 88480 46116" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
          <button type="submit" className="button button-primary mt-2" style={{ width: "100%" }}>
            {submitting ? "Sending..." : "Submit Details"}
          </button>
        </form>
      </div>
    </div>
  );
}

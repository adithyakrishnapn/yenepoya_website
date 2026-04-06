"use client";

import React, { useState } from "react";

export function ContactEnquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "Contact enquiry",
          name,
          username: name,
          email,
          phone,
          course,
          message
        })
      });

      const data = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok) {
        setError(data.error ?? "Failed to send enquiry");
        return;
      }

      setSuccess("Thank you. Our admissions team will contact you shortly.");
      setName("");
      setEmail("");
      setPhone("");
      setCourse("");
      setMessage("");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Failed to send enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" style={{ marginTop: "0.5rem" }}>
      <div>
        <label className="form-label" style={{ fontSize: "0.85rem", marginBottom: "0.3rem", display: "block" }}>Full Name</label>
        <input type="text" className="input" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid grid-2" style={{ gap: "1rem" }}>
        <div>
          <label className="form-label" style={{ fontSize: "0.85rem", marginBottom: "0.3rem", display: "block" }}>Email</label>
          <input type="email" className="input" placeholder="Your Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="form-label" style={{ fontSize: "0.85rem", marginBottom: "0.3rem", display: "block" }}>Phone</label>
          <input type="tel" className="input" placeholder="Enter phone number" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="form-label" style={{ fontSize: "0.85rem", marginBottom: "0.3rem", display: "block" }}>Interested Course</label>
        <select className="input" value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="" disabled>Select a course</option>
          <option value="BCA Artificial Intelligence & Cyber Security">BCA (Artificial Intelligence & Cyber Security)</option>
          <option value="BCA Cloud Computing & DevOps">BCA (Cloud Computing & DevOps)</option>
          <option value="BBA Aviation">BBA (Aviation, Travel and Tourism)</option>
          <option value="BBA Logistics">BBA (Logistics & Supply Chain)</option>
          <option value="BBA HR & Marketing">BBA (Human Resource & Marketing)</option>
          <option value="MBA General">MBA (Master of Business Administration)</option>
          <option value="Other">Other / Not Sure Yet</option>
        </select>
      </div>
      <div>
        <label className="form-label" style={{ fontSize: "0.85rem", marginBottom: "0.3rem", display: "block" }}>Your Message</label>
        <textarea className="input" placeholder="How can we help?" rows={4} required value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
      </div>
      {error ? <p style={{ margin: 0, color: "#b42318", fontSize: "0.9rem" }}>{error}</p> : null}
      {success ? <p style={{ margin: 0, color: "var(--primary)", fontSize: "0.9rem" }}>{success}</p> : null}
      <button type="submit" className="button button-primary" style={{ width: "100%", marginTop: "0.5rem" }} disabled={submitting}>
        {submitting ? "Sending..." : "Submit Enquiry"}
      </button>
    </form>
  );
}

"use client";

import React, { useState } from "react";

export function OTPEnquiryForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length > 5) setStep(2);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Verification Successful! Our admissions team will contact you shortly.");
    setStep(1);
    setPhone("");
    setOtp("");
  };

  return (
    <div className="card" style={{ background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(12px)", color: "var(--primary)" }}>
      <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
        {step === 1 ? "Verify Your Details" : "Enter OTP"}
      </h3>
      <p className="text-soft text-sm" style={{ marginBottom: "1.5rem" }}>
        {step === 1 ? "Please enter your details to proceed" : "Enter the 6-digit OTP sent to your WhatsApp"}
      </p>
      
      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
          <div>
            <label className="form-label">Phone Number</label>
            <input 
              type="tel" 
              required 
              className="input" 
              placeholder="+91 88480 46116" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button type="submit" className="button button-primary" style={{ width: "100%" }}>
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div>
            <label className="form-label">6-digit OTP</label>
            <input 
              type="text" 
              required 
              className="input" 
              placeholder="123456" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button type="submit" className="button button-primary" style={{ width: "100%", background: "var(--accent-gold)", color: "white" }}>
            Verify & Proceed
          </button>
        </form>
      )}
    </div>
  );
}

export function CourseVerifyGate({ courses }: { courses: { title: string; duration: string; price: string }[] }) {
  const [verified, setVerified] = useState(false);
  const [phone, setPhone] = useState("");

  if (!verified) {
    return (
      <div className="card text-center" style={{ margin: "3rem auto", maxWidth: "600px", padding: "3rem 2rem" }}>
        <h3 className="title-card mb-2" style={{ marginBottom: "1rem" }}>Verify to view all Course Fees</h3>
        <p className="text-soft mb-4" style={{ marginBottom: "2rem" }}>Enter your phone number to unlock the complete list of 250+ courses and their booking amounts.</p>
        <form 
          className="flex gap-2" 
          onSubmit={(e) => { e.preventDefault(); setVerified(true); }}
          style={{ maxWidth: "400px", margin: "0 auto" }}
        >
          <input 
            type="tel" 
            placeholder="+91 88480 46116" 
            className="input" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button type="submit" className="button button-primary" style={{ whiteSpace: "nowrap" }}>
            Verify
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-2" style={{ gap: "1.5rem" }}>
      {courses.map((course, i) => (
        <div key={i} className="card flex flex-col gap-2" style={{ background: "white", padding: "1.5rem" }}>
          <h4 className="title-card" style={{ fontSize: "1.1rem", lineHeight: 1.4 }}>{course.title}</h4>
          <div className="flex items-center gap-4 text-sm mt-auto" style={{ paddingTop: "1rem", borderTop: "1px solid var(--line)" }}>
            <span className="badge">Duration: {course.duration}</span>
            <span style={{ fontWeight: 600, color: "var(--accent-gold)" }}>Booking Amount: {course.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="accordion">
      {items.map((item, i) => (
        <div key={i} className="accordion-item">
          <button 
            className="accordion-trigger"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span>{String(i + 1).padStart(2, '0')}. {item.question}</span>
            <span style={{ transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
              ▼
            </span>
          </button>
          {openIndex === i && (
            <div className="accordion-content">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

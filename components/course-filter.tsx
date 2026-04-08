"use client";

import React, { useState } from "react";

const categories = [
  "All", 
  "Artificial Intelligence", 
  "Cyber Security", 
  "Cloud Computing", 
  "DevOps", 
  "Aviation", 
  "Logistics", 
  "Supply Chain", 
  "Human Resource", 
  "Marketing", 
  "Finance"
];

function CourseDetailModal({ course, onClose }: { course: { title: string, duration: string, price: string, description: string } | null, onClose: () => void }) {
  if (!course) return null;

  const feeBreakdown = [
    { year: "1st Year", amount: "₹1,32,000", details: "Tuition fee + Lab access + Library + Certification" },
    { year: "2nd Year", amount: "₹1,32,000", details: "Tuition fee + Lab access + Library + Certification" },
    { year: "3rd Year", amount: "₹1,32,000", details: "Tuition fee + Lab access + Library + Certification" }
  ];

  const isMBA = course.title.includes("MBA");
  if (isMBA) {
    feeBreakdown.pop();
    feeBreakdown.push({ year: "2nd Year", amount: "₹1,32,000", details: "Tuition fee + Lab access + Library + Certification" });
  }

  return (
    <div style={{
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
    }}>
      <div style={{
        background: "white",
        width: "min(800px, 94vw)",
        maxHeight: "90vh",
        overflowY: "auto",
        borderRadius: "22px",
        border: "1px solid rgba(15, 76, 129, 0.16)",
        boxShadow: "0 28px 64px rgba(8, 35, 57, 0.24)",
        position: "relative",
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      }} className="hide-scrollbar">
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
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
            justifyContent: "center",
            zIndex: 1000
          }}
        >
          ×
        </button>

        <div style={{
          padding: "1.4rem 1.4rem 1rem",
          borderBottom: "1px solid rgba(15, 76, 129, 0.1)",
          background: "linear-gradient(135deg, rgba(21, 101, 160, 0.12) 0%, rgba(0, 167, 204, 0.09) 100%)"
        }}>
          <p style={{ margin: 0, fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: "var(--primary)" }}>
            Course Details & Fee Structure
          </p>
          <h2 style={{ fontSize: "1.45rem", color: "var(--primary)", margin: "0.25rem 0 0.35rem", lineHeight: 1.2 }}>
            {course.title}
          </h2>
        </div>

        <div style={{ padding: "1.5rem 1.4rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-soft)" }}>Duration</p>
              <p style={{ margin: "0.3rem 0 0", fontSize: "1.2rem", fontWeight: 700, color: "var(--primary)" }}>{course.duration}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-soft)" }}>Booking Amount</p>
              <p style={{ margin: "0.3rem 0 0", fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-gold)" }}>₹26,000</p>
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ margin: "0 0 1rem", fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)" }}>Detailed Fee Structure</h3>
            <div style={{ display: "grid", gap: "0.8rem" }}>
              {feeBreakdown.map((item, idx) => (
                <div key={idx} style={{
                  padding: "0.8rem",
                  background: "rgba(21, 101, 160, 0.06)",
                  borderLeft: "4px solid var(--primary)",
                  borderRadius: "4px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "var(--primary)" }}>{item.year}</p>
                      <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--text-soft)" }}>{item.details}</p>
                    </div>
                    <p style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--accent-gold)", whiteSpace: "nowrap" }}>{item.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: "rgba(245, 147, 0, 0.08)",
            border: "1px solid rgba(245, 147, 0, 0.2)",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem"
          }}>
            <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "var(--accent-gold)" }}>📌 Note</p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem", color: "var(--text-soft)" }}>Separate scholarships and concessional fees may be available for eligible candidates. Contact admissions for details.</p>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="/assets/brochure.pdf" download style={{
              flex: 1,
              minWidth: "200px",
              padding: "0.9rem 1.5rem",
              background: "var(--accent-gold)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "none",
              textAlign: "center",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.3s ease"
            }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
              📄 Download Brochure (PDF)
            </a>
            <button onClick={onClose} style={{
              flex: 1,
              minWidth: "200px",
              padding: "0.9rem 1.5rem",
              background: "white",
              color: "var(--primary)",
              border: "2px solid var(--primary)",
              borderRadius: "12px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.3s ease"
            }} onMouseEnter={(e) => {e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "white";}} onMouseLeave={(e) => {e.currentTarget.style.background = "white"; e.currentTarget.style.color = "var(--primary)";}}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CourseFilter({ courses }: { courses: { title: string, duration: string, price: string, description: string }[] }) {
  const [active, setActive] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState<{ title: string, duration: string, price: string, description: string } | null>(null);

  const filtered = active === "All" ? courses : courses.filter(c => c.title.includes(active) || c.description.includes(active));

  return (
    <div>
      <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />

      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h2 className="title-display" style={{ fontSize: "2.5rem" }}>What's Your <span style={{ color: "var(--accent-gold)" }}>Interest?</span></h2>
        <p className="text-soft mt-2">Filter our comprehensive programs to match your career goals. Click a course to view detailed fee structure.</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-8" style={{ maxWidth: "1000px", margin: "0 auto 3rem auto" }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActive(cat)}
            style={{
              padding: "0.6rem 1.4rem",
              borderRadius: "8px",
              border: active === cat ? "1px solid var(--accent-gold)" : "1px solid rgba(0,0,0,0.1)",
              background: active === cat ? "var(--accent-gold)" : "white",
              color: active === cat ? "white" : "var(--primary)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              transform: active === cat ? "scale(1.05)" : "scale(1)",
              boxShadow: active === cat ? "0 10px 20px rgba(245, 147, 0, 0.3)" : "0 2px 5px rgba(0,0,0,0.02)"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <p className="text-soft">No courses found matching this interest.</p>
        </div>
      ) : (
        <div className="grid grid-2" style={{ gap: "1.5rem" }}>
          {filtered.map((course, i) => (
            <div key={i} className="card flex flex-col gap-2" style={{ background: "white", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", transition: "transform 0.3s ease, box-shadow 0.3s ease", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }} 
              onClick={() => setSelectedCourse(course)}
              onMouseEnter={(e) => {e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(15, 76, 129, 0.15)";}} 
              onMouseLeave={(e) => {e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";}}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", background: "rgba(245, 147, 0, 0.1)", color: "var(--accent-gold)", borderRadius: "4px", fontWeight: "bold" }}>{active !== "All" ? active : "Program"}</span>
              </div>
              <h4 className="title-card" style={{ fontSize: "1.1rem", lineHeight: 1.4, color: "var(--primary)" }}>{course.title}</h4>
              <p className="text-soft mb-2" style={{ fontSize: "0.9rem" }}>{course.description}</p>
              <div className="flex items-center gap-4 text-sm mt-auto" style={{ paddingTop: "1rem", borderTop: "1px solid var(--line)" }}>
                <span className="badge">Duration: {course.duration}</span>
                <span style={{ fontWeight: 600, color: "var(--accent-gold)" }}>Booking Amount: {course.price}</span>
              </div>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, display: "none" }}>👆 Click to view detailed fees</p>
              <button
                onClick={() => setSelectedCourse(course)}
                style={{
                  marginTop: "0.75rem",
                  padding: "0.7rem 1rem",
                  background: "var(--accent-gold)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  width: "100%",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                View Details & Fees
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

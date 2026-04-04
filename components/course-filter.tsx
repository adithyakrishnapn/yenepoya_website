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

export function CourseFilter({ courses }: { courses: { title: string, duration: string, price: string, description: string }[] }) {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? courses : courses.filter(c => c.title.includes(active) || c.description.includes(active));

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h2 className="title-display" style={{ fontSize: "2.5rem" }}>What's Your <span style={{ color: "var(--accent-gold)" }}>Interest?</span></h2>
        <p className="text-soft mt-2">Filter our comprehensive programs to match your career goals.</p>
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
            <div key={i} className="card flex flex-col gap-2" style={{ background: "white", padding: "1.5rem", border: "1px solid rgba(0,0,0,0.05)", transition: "transform 0.3s ease", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", background: "rgba(245, 147, 0, 0.1)", color: "var(--accent-gold)", borderRadius: "4px", fontWeight: "bold" }}>{active !== "All" ? active : "Program"}</span>
              </div>
              <h4 className="title-card" style={{ fontSize: "1.1rem", lineHeight: 1.4, color: "var(--primary)" }}>{course.title}</h4>
              <p className="text-soft mb-2" style={{ fontSize: "0.9rem" }}>{course.description}</p>
              <div className="flex items-center gap-4 text-sm mt-auto" style={{ paddingTop: "1rem", borderTop: "1px solid var(--line)" }}>
                <span className="badge">Duration: {course.duration}</span>
                <span style={{ fontWeight: 600, color: "var(--accent-gold)" }}>Booking Amount: {course.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

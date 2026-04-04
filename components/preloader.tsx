"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-label="Loading site"
      role="status"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #0f4c81 0%, #1565a0 100%)",
        transition: "opacity 300ms ease",
        animation: "fadeOut 2800ms ease forwards"
      }}
    >
      <div style={{ display: "grid", gap: "2rem", justifyItems: "center", textAlign: "center" }}>
        <div style={{ position: "relative", width: 100, height: 100 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "3px solid rgba(0, 212, 255, 0.3)",
              animation: "spin 3s linear infinite"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 8,
              borderRadius: "50%",
              border: "3px solid rgba(0, 212, 255, 0.6)",
              animation: "spin 2s linear reverse infinite"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 16,
              borderRadius: "50%",
              border: "2px solid #00d4ff",
              animation: "pulse 2s ease-in-out infinite"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "50%",
              width: 12,
              height: 12,
              transform: "translate(-50%, -50%)",
              backgroundColor: "#00d4ff",
              borderRadius: "50%",
              boxShadow: "0 0 20px rgba(0, 212, 255, 0.8)"
            }}
          />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, color: "#fff", fontFamily: "var(--font-display)" }}>
            Yenepoya
          </h2>
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
            Excellence in Education
          </p>
        </div>
        <div style={{ width: 200, height: 3, background: "rgba(0,212,255,0.2)", borderRadius: 2, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #00d4ff, #0099cc)",
              animation: "slideRight 2.5s ease-in-out"
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes slideRight {
          0% { width: 0; }
          100% { width: 100%; }
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
      `}</style>
    </div>
  );
}

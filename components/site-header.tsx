"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/courses", label: "Programs" },
  { href: "/blog", label: "Blogs" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="site-logo">
          <span style={{ fontSize: "1.3rem", fontWeight: 800, background: "linear-gradient(135deg, #0f4c81 0%, #00d4ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontFamily: "var(--font-display)" }}>YENEPOYA</span>
          <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", color: "#0f4c81" }}>MUDIPU CAMPUS</span>
        </Link>
        <nav className={`site-nav ${menuOpen ? "is-open" : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-item"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/admissions/apply" className="btn btn-header header-apply">
          Apply Now
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

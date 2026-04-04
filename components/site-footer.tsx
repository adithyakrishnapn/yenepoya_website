import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>About Yenepoya</h4>
            <p>
              Yenepoya Institute of Arts, Science, Commerce, and Management (YIASCM) offers
              industry-aligned programs that prepare students for successful careers.
            </p>
          </div>

          <div className="footer-section">
            <h4>Our Info</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/courses">Our Courses</Link></li>
              <li><Link href="/blog">Our Blogs</Link></li>
              <li><Link href="/admissions">Admissions</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Useful Links</h4>
            <ul>
              <li>
                <Link href="/admissions/apply">Apply Now</Link>
              </li>
              <li>
                <Link href="/admin/login">Admin Login</Link>
              </li>
              <li>
                <Link href="https://wa.me/918848046116?text=Hello%20I%20need%20more%20information">
                  WhatsApp Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>University Road, Deralakatte</li>
              <li>Mangaluru, Karnataka 575018</li>
              <li><Link href="tel:+918848046116">+91 88480 46116</Link></li>
              <li><Link href="tel:+917994228008">+91 79942 28008</Link></li>
              <li><Link href="mailto:info@mudipu.yenepoya.edu.in">info@mudipu.yenepoya.edu.in</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{year} • Rooted in knowledge, driven by purpose.</span>
          <span>Admissions for the academic year 2026-27 are open.</span>
        </div>
      </div>
    </footer>
  );
}

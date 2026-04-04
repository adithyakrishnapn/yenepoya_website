import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section" style={{ paddingTop: "5rem" }}>
      <div className="container">
        <div className="card card-pad" style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
          <span className="kicker">404</span>
          <h1 className="section-title" style={{ marginTop: "0.75rem", marginInline: "auto" }}>Page not found</h1>
          <p className="section-copy" style={{ marginInline: "auto" }}>
            The page you requested does not exist or has moved.
          </p>
          <Link href="/" className="button button-primary">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}

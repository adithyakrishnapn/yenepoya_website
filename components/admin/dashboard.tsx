"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/auth-provider";
import type { BlogPost } from "@/lib/blogs";
import { recordPerformanceEvent } from "@/lib/performance";
import { fetchPerformanceEvents as loadPerformanceEvents } from "@/lib/performance";
import type { PerformanceEventRecord } from "@/lib/performance";

type PerformanceEvent = PerformanceEventRecord;

type BlogFormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

const initialForm: BlogFormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "<p></p>",
  image: "https://mudipu.yenepoyauniversity.online/assets/hero_campus_banner.png",
  category: "Admissions",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "Yenepoya University Mudipu, admissions"
};

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export function AdminDashboard() {
  const router = useRouter();
  const { user, loading, isAdmin, logout } = useAdminAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormState>(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [performanceEvents, setPerformanceEvents] = useState<PerformanceEvent[]>([]);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [performanceError, setPerformanceError] = useState("");

  const isEditing = useMemo(() => Boolean(editingSlug), [editingSlug]);

  function scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/admin/login");
    }
  }, [loading, user, isAdmin, router]);

  async function fetchBlogs() {
    try {
      const response = await fetch("/api/blogs", { cache: "no-store" });
      if (!response.ok) {
        setError("Failed to load blogs");
        return;
      }

      const data = (await response.json()) as { data?: BlogPost[] };
      const next = (data.data ?? [])
        .filter((blog) => blog.slug && blog.title)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setBlogs(next);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load blogs");
    }
  }

  useEffect(() => {
    void fetchBlogs();
  }, []);

  async function fetchPerformanceEvents() {
    setPerformanceLoading(true);
    setPerformanceError("");

    try {
      const next = await loadPerformanceEvents();
      setPerformanceEvents(next);
    } catch (error) {
      setPerformanceError(error instanceof Error ? error.message : "Failed to load performance data");
    } finally {
      setPerformanceLoading(false);
    }
  }

  async function sendTestEvent() {
    setPerformanceError("");
    setMessage("");

    try {
      await recordPerformanceEvent({
        kind: "visit",
        source: "Admin dashboard test event",
        blogSlug: "dashboard-test",
        blogTitle: "Dashboard test event",
        path: "/admin/dashboard",
        referrer: "Admin dashboard"
      });

      setMessage("Test event sent. Refreshing analytics...");
      await fetchPerformanceEvents();
    } catch (error) {
      setPerformanceError(error instanceof Error ? error.message : "Failed to send test event");
    }
  }

  useEffect(() => {
    void fetchPerformanceEvents();
  }, []);

  function onEdit(blog: BlogPost) {
    setEditingSlug(blog.slug);
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      category: blog.category,
      seoTitle: blog.seoTitle,
      seoDescription: blog.seoDescription,
      seoKeywords: blog.seoKeywords.join(", ")
    });
    setMessage("");
    setError("");
  }

  function resetForm() {
    setEditingSlug(null);
    setForm(initialForm);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!user) {
      setError("Authentication required");
      return;
    }

    const nextSlug = toSlug(form.slug || form.title);
    const payload = {
      title: form.title,
      slug: nextSlug,
      excerpt: form.excerpt,
      content: form.content,
      image: form.image,
      category: form.category,
      seoTitle: form.seoTitle || form.title,
      seoDescription: form.seoDescription || form.excerpt,
      seoKeywords: form.seoKeywords.split(",").map((item) => item.trim()).filter(Boolean),
      status: "published"
    };

    try {
      const response = await fetch(isEditing ? `/api/blogs/${encodeURIComponent(editingSlug ?? "")}` : "/api/blogs", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok) {
        setError(data.error ?? "Failed to save blog");
        return;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save blog");
      return;
    }

    setMessage(isEditing ? "Blog updated" : "Blog created");
    resetForm();
    await fetchBlogs();
  }

  async function remove(slug: string) {
    setError("");
    setMessage("");

    if (!user) {
      setError("Authentication required");
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${encodeURIComponent(slug)}`, {
        method: "DELETE"
      });

      const data = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok) {
        setError(data.error ?? "Failed to delete blog");
        return;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete blog");
      return;
    }

    setMessage("Blog deleted");
    await fetchBlogs();
  }

  if (loading) {
    return <p>Checking admin session...</p>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  const leadEvents = performanceEvents.filter((event) => event.kind === "lead");
  const visitEvents = performanceEvents.filter((event) => event.kind === "visit");
  const uniqueContacts = new Set(
    leadEvents.map((event) => event.email || event.phone || event.name || event.source)
  ).size;

  const leadSources = leadEvents.reduce<Record<string, number>>((accumulator, event) => {
    accumulator[event.source] = (accumulator[event.source] ?? 0) + 1;
    return accumulator;
  }, {});

  const topLeadSources = Object.entries(leadSources)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4);

  const topVisitedBlogs = visitEvents.reduce<Record<string, number>>((accumulator, event) => {
    const key = event.blogTitle || event.blogSlug || event.path || event.source;
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  const topVisitedBlogEntries = Object.entries(topVisitedBlogs)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5);

  const performanceCards = [
    {
      label: "Lead submissions",
      value: leadEvents.length,
      note: "Forms, WhatsApp leads, and direct enquiries"
    },
    {
      label: "Blog visits",
      value: visitEvents.length,
      note: "Tracked visits across all blog pages"
    },
    {
      label: "Unique contacts",
      value: uniqueContacts,
      note: "Distinct people captured from forms"
    }
  ];

  const visualBars = [
    { label: "Visits", value: visitEvents.length, color: "var(--primary)" },
    { label: "Leads", value: leadEvents.length, color: "var(--accent)" },
    { label: "Unique", value: uniqueContacts, color: "var(--accent-dark)" }
  ];

  const highestVisualValue = Math.max(...visualBars.map((entry) => entry.value), 1);

  return (
    <section className="section" style={{ paddingTop: "2.5rem" }}>
      <div className="container grid" style={{ gap: "1rem" }}>
        <div className="card card-pad" style={dashboardShellStyle}>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ maxWidth: "62ch" }}>
                <span className="kicker">Admin dashboard</span>
                <h1 className="section-title" style={{ marginTop: "0.7rem", fontSize: "2.6rem" }}>Dashboard for blog growth and leads</h1>
                <p style={{ margin: "0.4rem 0 0", color: "var(--text-soft)", fontSize: "1.02rem" }}>
                  Manage content, publish new articles, and monitor how many visitors, form fills, and WhatsApp leads your blogs are generating.
                </p>
              </div>

              <button className="button button-secondary" onClick={() => void logout()}>Sign out</button>
            </div>

            <div className="button-row" style={{ flexWrap: "wrap" }}>
              <button className="button button-primary" onClick={() => scrollToSection("create-blog")}>Create Blog</button>
              <button className="button button-secondary" onClick={() => scrollToSection("manage-blogs")}>Manage Blog</button>
              <button className="button button-secondary" onClick={() => scrollToSection("performance-dashboard")}>View Analytics</button>
              <button className="button button-secondary" type="button" onClick={() => void sendTestEvent()}>Send Test Event</button>
            </div>

            <div className="grid grid-3" style={{ gap: "0.9rem" }}>
              {performanceCards.map((card) => (
                <div key={card.label} className="card" style={summaryCardStyle}>
                  <strong style={summaryValueStyle}>{card.value}</strong>
                  <span style={summaryLabelStyle}>{card.label}</span>
                  <p style={{ margin: "0.25rem 0 0", color: "var(--text-soft)", fontSize: "0.92rem" }}>{card.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="performance-dashboard" className="grid grid-2" style={{ gap: "1rem" }}>
          <div className="card card-pad" style={{ display: "grid", gap: "1rem" }}>
            <div>
              <span className="kicker">Performance</span>
              <h2 style={{ margin: "0.6rem 0 0", fontFamily: "var(--font-display)", fontSize: "1.9rem" }}>Data visualization at a glance</h2>
              <p style={{ margin: "0.35rem 0 0", color: "var(--text-soft)" }}>Quickly compare visits, leads, and unique contacts with a visual breakdown.</p>
            </div>

            <div className="grid" style={{ gap: "0.8rem" }}>
              {visualBars.map((entry) => (
                <div key={entry.label} style={{ display: "grid", gap: "0.35rem" }}>
                  <div className="meta-row" style={{ justifyContent: "space-between" }}>
                    <span>{entry.label}</span>
                    <strong>{entry.value}</strong>
                  </div>
                  <div style={barTrackStyle}>
                    <div
                      style={{
                        ...barFillStyle,
                        width: `${Math.max((entry.value / highestVisualValue) * 100, entry.value ? 14 : 0)}%`,
                        background: `linear-gradient(90deg, ${entry.color} 0%, var(--accent) 100%)`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-2" style={{ gap: "0.8rem" }}>
              <div className="card" style={subtlePanelStyle}>
                <strong style={{ display: "block", marginBottom: "0.5rem" }}>Top lead sources</strong>
                {topLeadSources.length ? (
                  <div className="grid" style={{ gap: "0.7rem" }}>
                    {topLeadSources.map(([source, count]) => (
                      <div key={source} style={{ display: "grid", gap: "0.35rem" }}>
                        <div className="meta-row" style={{ justifyContent: "space-between" }}>
                          <span>{source}</span>
                          <strong>{count}</strong>
                        </div>
                        <div style={barTrackStyle}>
                          <div style={{ ...barFillStyle, width: `${Math.max((count / Math.max(topLeadSources[0]?.[1] ?? 1, 1)) * 100, 12)}%`, background: "linear-gradient(90deg, var(--accent) 0%, var(--accent-dark) 100%)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, color: "var(--text-soft)" }}>No lead data yet.</p>
                )}
              </div>

              <div className="card" style={subtlePanelStyle}>
                <strong style={{ display: "block", marginBottom: "0.5rem" }}>Most visited blogs</strong>
                {topVisitedBlogEntries.length ? (
                  <div className="grid" style={{ gap: "0.7rem" }}>
                    {topVisitedBlogEntries.map(([title, count]) => (
                      <div key={title} style={{ display: "grid", gap: "0.35rem" }}>
                        <div className="meta-row" style={{ justifyContent: "space-between", gap: "0.75rem" }}>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
                          <strong>{count}</strong>
                        </div>
                        <div style={barTrackStyle}>
                          <div style={{ ...barFillStyle, width: `${Math.max((count / Math.max(topVisitedBlogEntries[0]?.[1] ?? 1, 1)) * 100, 12)}%`, background: "linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, color: "var(--text-soft)" }}>No blog visits tracked yet.</p>
                )}
              </div>
            </div>

            {performanceError ? <p style={{ margin: 0, color: "#b42318" }}>{performanceError}</p> : null}
            {performanceLoading ? <p style={{ margin: 0, color: "var(--text-soft)" }}>Loading performance data...</p> : null}
            {message ? <p style={{ margin: 0, color: "var(--accent)" }}>{message}</p> : null}
          </div>

          <div className="card card-pad" style={{ display: "grid", gap: "0.9rem" }}>
            <div>
              <span className="kicker">Live feed</span>
              <h3 style={{ margin: "0.6rem 0 0", fontFamily: "var(--font-display)", fontSize: "1.55rem" }}>Recent activity</h3>
            </div>

            <div className="grid" style={{ gap: "0.75rem" }}>
              {performanceEvents.length ? (
                performanceEvents.slice(0, 8).map((event) => (
                  <article key={event.id} style={activityCardStyle}>
                    <div className="meta-row" style={{ justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
                      <strong>{event.kind === "lead" ? "Lead submission" : "Blog visit"}</strong>
                      <span style={{ color: "var(--text-soft)" }}>{new Date(event.createdAt).toLocaleString("en-IN")}</span>
                    </div>
                    <p style={{ margin: 0, color: "var(--text-soft)" }}>{event.source}</p>
                    {event.kind === "lead" ? (
                      <div className="grid grid-2" style={{ gap: "0.35rem" }}>
                        <p style={{ margin: 0 }}>Name: {event.name || "—"}</p>
                        <p style={{ margin: 0 }}>Phone: {event.phone || "—"}</p>
                        <p style={{ margin: 0 }}>Email: {event.email || "—"}</p>
                        <p style={{ margin: 0 }}>Course: {event.course || "—"}</p>
                      </div>
                    ) : (
                      <div className="grid grid-2" style={{ gap: "0.35rem" }}>
                        <p style={{ margin: 0 }}>Page: {event.path || event.blogSlug || "—"}</p>
                        <p style={{ margin: 0 }}>Referrer: {event.referrer || "Direct"}</p>
                      </div>
                    )}
                  </article>
                ))
              ) : (
                <p style={{ margin: 0, color: "var(--text-soft)" }}>No performance activity yet.</p>
              )}
            </div>
          </div>
        </div>

        <div id="create-blog" className="card card-pad" style={{ display: "grid", gap: "1rem" }}>
          <div className="meta-row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="kicker">Content</span>
              <h2 style={{ margin: "0.6rem 0 0", fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>{isEditing ? "Edit blog" : "Create blog"}</h2>
              <p style={{ margin: "0.35rem 0 0", color: "var(--text-soft)" }}>Draft, publish, and optimize posts from the same control panel.</p>
            </div>
            <button className="button button-secondary" type="button" onClick={() => scrollToSection("manage-blogs")}>Go to Manage Blog</button>
          </div>

          <form className="grid" style={{ gap: "0.8rem" }} onSubmit={submit}>
            <div className="grid grid-2">
              <input placeholder="Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value, slug: prev.slug || toSlug(e.target.value) }))} style={fieldStyle} required />
              <input placeholder="Slug" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: toSlug(e.target.value) }))} style={fieldStyle} required />
            </div>
            <div className="grid grid-2">
              <input placeholder="Category" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} style={fieldStyle} required />
              <input placeholder="Image URL" value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} style={fieldStyle} required />
            </div>
            <textarea placeholder="Excerpt" rows={3} value={form.excerpt} onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))} style={fieldStyle} required />
            <div className="grid grid-2">
              <input placeholder="SEO Title" value={form.seoTitle} onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))} style={fieldStyle} />
              <input placeholder="SEO Description" value={form.seoDescription} onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))} style={fieldStyle} />
            </div>
            <input placeholder="SEO Keywords (comma separated)" value={form.seoKeywords} onChange={(e) => setForm((prev) => ({ ...prev, seoKeywords: e.target.value }))} style={fieldStyle} />
            <textarea placeholder="HTML Content" rows={14} value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} style={fieldStyle} required />

            <div className="button-row">
              <button className="button button-primary" type="submit">{isEditing ? "Update blog" : "Create blog"}</button>
              {isEditing ? <button type="button" className="button button-secondary" onClick={resetForm}>Cancel edit</button> : null}
            </div>
            {message ? <p style={{ margin: 0, color: "var(--accent)" }}>{message}</p> : null}
            {error ? <p style={{ margin: 0, color: "#b42318" }}>{error}</p> : null}
          </form>
        </div>

        <div id="manage-blogs" className="card card-pad" style={{ display: "grid", gap: "1rem" }}>
          <div className="meta-row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="kicker">Library</span>
              <h2 style={{ margin: "0.6rem 0 0", fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>Manage Blog</h2>
              <p style={{ margin: "0.35rem 0 0", color: "var(--text-soft)" }}>Edit or remove published posts from the list below.</p>
            </div>
          </div>

          <div className="grid" style={{ gap: "0.8rem" }}>
            {blogs.length ? (
              blogs.map((blog) => (
                <article key={blog.id} className="card" style={blogCardStyle}>
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    <div className="meta-row" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                      <div>
                        <strong style={{ display: "block", fontSize: "1.05rem" }}>{blog.title}</strong>
                        <p style={{ margin: "0.2rem 0 0", color: "var(--text-soft)" }}>/blog/{blog.slug}</p>
                      </div>
                      <span style={chipStyle}>{blog.category}</span>
                    </div>
                    <p style={{ margin: 0, color: "var(--text-soft)" }}>{blog.excerpt}</p>
                    <div className="button-row">
                      <button className="button button-secondary" onClick={() => onEdit(blog)}>Edit</button>
                      <button className="button button-secondary" onClick={() => void remove(blog.slug)}>Delete</button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p style={{ margin: 0, color: "var(--text-soft)" }}>No blogs available yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const fieldStyle: CSSProperties = {
  width: "100%",
  borderRadius: 16,
  border: "1px solid rgba(19,34,56,0.12)",
  background: "rgba(255,255,255,0.9)",
  padding: "0.9rem 1rem",
  color: "var(--text)"
};

const summaryCardStyle: CSSProperties = {
  padding: "1rem",
  borderRadius: 18,
  background: "linear-gradient(180deg, #ffffff 0%, #f4f9fc 100%)",
  border: "1px solid rgba(19,34,56,0.08)",
  display: "grid",
  gap: "0.25rem"
};

const summaryValueStyle: CSSProperties = {
  fontSize: "1.9rem",
  color: "var(--primary)",
  fontFamily: "var(--font-display)"
};

const summaryLabelStyle: CSSProperties = {
  color: "var(--text-soft)",
  fontSize: "0.92rem"
};

const dashboardShellStyle: CSSProperties = {
  background: "linear-gradient(135deg, rgba(15,76,129,0.08) 0%, rgba(255,255,255,0.96) 42%, rgba(0,212,255,0.08) 100%)",
  border: "1px solid rgba(19,34,56,0.08)",
  boxShadow: "0 18px 50px rgba(15, 76, 129, 0.08)"
};

const subtlePanelStyle: CSSProperties = {
  padding: "1rem",
  borderRadius: 18,
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbfd 100%)",
  border: "1px solid rgba(19,34,56,0.08)"
};

const barTrackStyle: CSSProperties = {
  width: "100%",
  height: 10,
  borderRadius: 999,
  background: "rgba(15, 76, 129, 0.08)",
  overflow: "hidden"
};

const barFillStyle: CSSProperties = {
  height: "100%",
  borderRadius: 999,
  transition: "width 240ms ease"
};

const activityCardStyle: CSSProperties = {
  padding: "1rem",
  borderRadius: 18,
  background: "#fff",
  border: "1px solid rgba(19,34,56,0.08)",
  display: "grid",
  gap: "0.55rem"
};

const blogCardStyle: CSSProperties = {
  padding: "1rem",
  borderRadius: 18,
  background: "linear-gradient(180deg, #ffffff 0%, #f9fbfe 100%)",
  border: "1px solid rgba(19,34,56,0.08)"
};

const chipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 999,
  padding: "0.35rem 0.75rem",
  background: "rgba(0, 212, 255, 0.12)",
  color: "var(--primary)",
  fontSize: "0.85rem",
  fontWeight: 700,
  whiteSpace: "nowrap"
};

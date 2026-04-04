"use client";

import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function splitKeywords(value: string) {
  return value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function BlogEditor() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Campus Life");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("Yenepoya University Mudipu, campus blog, higher education");
  const [htmlContent, setHtmlContent] = useState("<p>Write HTML content for the article here.</p>");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  const computedSlug = useMemo(() => slug || slugify(title), [slug, title]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const payload = {
      title,
      slug: computedSlug,
      excerpt,
      category,
      htmlContent,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      seoKeywords: splitKeywords(seoKeywords),
      status: "published",
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      if (db) {
        await addDoc(collection(db, "blogs"), payload);
        setStatus("saved");
        setMessage("Blog saved to Firestore. Sitemap and detail pages will pick it up automatically.");
      } else {
        const drafts = JSON.parse(window.localStorage.getItem("yenepoya_blog_drafts") ?? "[]") as typeof payload[];
        drafts.unshift(payload);
        window.localStorage.setItem("yenepoya_blog_drafts", JSON.stringify(drafts));
        setStatus("saved");
        setMessage("Firebase is not configured yet, so this draft was saved locally for preview.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to save blog post.");
    }
  }

  return (
    <form className="grid" onSubmit={handleSubmit} style={{ gap: "1rem" }}>
      <div className="grid grid-2">
        <label className="grid" style={{ gap: 6 }}>
          <span>Title</span>
          <input required value={title} onChange={(event) => { const nextTitle = event.target.value; setTitle(nextTitle); if (!slug) { setSlug(slugify(nextTitle)); } }} style={fieldStyle} />
        </label>
        <label className="grid" style={{ gap: 6 }}>
          <span>Slug</span>
          <input required value={computedSlug} onChange={(event) => setSlug(slugify(event.target.value))} style={fieldStyle} />
        </label>
      </div>
      <div className="grid grid-2">
        <label className="grid" style={{ gap: 6 }}>
          <span>Category</span>
          <input value={category} onChange={(event) => setCategory(event.target.value)} style={fieldStyle} />
        </label>
        <label className="grid" style={{ gap: 6 }}>
          <span>Excerpt</span>
          <input required value={excerpt} onChange={(event) => setExcerpt(event.target.value)} style={fieldStyle} />
        </label>
      </div>
      <div className="grid grid-2">
        <label className="grid" style={{ gap: 6 }}>
          <span>SEO title</span>
          <input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} style={fieldStyle} />
        </label>
        <label className="grid" style={{ gap: 6 }}>
          <span>SEO description</span>
          <input value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} style={fieldStyle} />
        </label>
      </div>
      <label className="grid" style={{ gap: 6 }}>
        <span>SEO keywords</span>
        <input value={seoKeywords} onChange={(event) => setSeoKeywords(event.target.value)} style={fieldStyle} />
      </label>
      <label className="grid" style={{ gap: 6 }}>
        <span>HTML content</span>
        <textarea required rows={16} value={htmlContent} onChange={(event) => setHtmlContent(event.target.value)} style={{ ...fieldStyle, minHeight: 320, resize: "vertical" }} />
      </label>
      <div className="card card-pad" style={{ background: "rgba(14,92,82,0.06)" }}>
        <strong>Preview</strong>
        <p style={{ marginBottom: 0, color: "var(--text-soft)" }}>
          The editor accepts raw HTML so you can paste rich article markup, headings, lists, and links directly into the content area.
        </p>
      </div>
      <div className="button-row">
        <button type="submit" className="button button-primary" disabled={status === "saving"}>
          {status === "saving" ? "Publishing..." : "Publish blog"}
        </button>
      </div>
      {message ? (
        <p style={{ margin: 0, color: status === "error" ? "#a33d2e" : "var(--accent)" }}>
          {message}
        </p>
      ) : null}
    </form>
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

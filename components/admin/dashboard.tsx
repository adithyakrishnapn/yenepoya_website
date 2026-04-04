"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { useAdminAuth } from "@/components/admin/auth-provider";
import type { BlogPost } from "@/lib/blogs";
import { db } from "@/lib/firebase/client";

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

  const isEditing = useMemo(() => Boolean(editingSlug), [editingSlug]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/admin/login");
    }
  }, [loading, user, isAdmin, router]);

  async function fetchBlogs() {
    if (!db) {
      setError("Firebase Firestore is not configured");
      return;
    }

    const snap = await getDocs(collection(db, "blogs"));
    const next = snap.docs
      .map((item) => {
        const raw = item.data() as Record<string, unknown>;
        const createdAtValue = raw.createdAt as { toDate?: () => Date } | undefined;
        const updatedAtValue = raw.updatedAt as { toDate?: () => Date } | undefined;

        return {
          id: item.id,
          title: typeof raw.title === "string" ? raw.title : "",
          slug: typeof raw.slug === "string" ? raw.slug : "",
          excerpt: typeof raw.excerpt === "string" ? raw.excerpt : "",
          content: typeof raw.content === "string" ? raw.content : "",
          image: typeof raw.image === "string" ? raw.image : "",
          category: typeof raw.category === "string" ? raw.category : "Insights",
          seoTitle: typeof raw.seoTitle === "string" ? raw.seoTitle : "",
          seoDescription: typeof raw.seoDescription === "string" ? raw.seoDescription : "",
          seoKeywords: Array.isArray(raw.seoKeywords)
            ? raw.seoKeywords.filter((entry): entry is string => typeof entry === "string")
            : [],
          createdAt: createdAtValue?.toDate ? createdAtValue.toDate().toISOString() : new Date().toISOString(),
          updatedAt: updatedAtValue?.toDate ? updatedAtValue.toDate().toISOString() : undefined,
          status: raw.status === "draft" ? "draft" : "published"
        } satisfies BlogPost;
      })
      .filter((blog) => blog.slug && blog.title)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setBlogs(next);
  }

  useEffect(() => {
    void fetchBlogs();
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

    if (!db || !user) {
      setError("Authentication required");
      return;
    }

    const nextSlug = toSlug(form.slug || form.title);

    const duplicateQuery = query(collection(db, "blogs"), where("slug", "==", nextSlug));
    const duplicateSnap = await getDocs(duplicateQuery);
    const hasDuplicate = duplicateSnap.docs.some((entry) => {
      if (!isEditing) return true;
      return entry.id !== blogs.find((blog) => blog.slug === editingSlug)?.id;
    });

    if (hasDuplicate) {
      setError("slug already exists");
      return;
    }

    const payload: Record<string, unknown> = {
      title: form.title,
      slug: nextSlug,
      excerpt: form.excerpt,
      content: form.content,
      image: form.image,
      category: form.category,
      seoTitle: form.seoTitle || form.title,
      seoDescription: form.seoDescription || form.excerpt,
      seoKeywords: form.seoKeywords.split(",").map((item) => item.trim()).filter(Boolean),
      status: "published",
      updatedAt: serverTimestamp()
    };

    try {
      if (isEditing) {
        const current = blogs.find((blog) => blog.slug === editingSlug);
        if (!current) {
          setError("Blog not found");
          return;
        }

        await updateDoc(doc(db, "blogs", current.id), payload);
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, "blogs"), payload);
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

    if (!db || !user) {
      setError("Authentication required");
      return;
    }

    const current = blogs.find((blog) => blog.slug === slug);
    if (!current) {
      setError("Blog not found");
      return;
    }

    try {
      await deleteDoc(doc(db, "blogs", current.id));
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

  return (
    <section className="section" style={{ paddingTop: "3rem" }}>
      <div className="container grid" style={{ gap: "1rem" }}>
        <div className="card card-pad" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <span className="kicker">Admin dashboard</span>
            <h1 className="section-title" style={{ marginTop: "0.7rem", fontSize: "2.3rem" }}>Manage Blogs</h1>
            <p style={{ margin: 0, color: "var(--text-soft)" }}>Signed in as {user.email}</p>
          </div>
          <button className="button button-secondary" onClick={() => void logout()}>Sign out</button>
        </div>

        <div className="card card-pad">
          <h2 style={{ marginTop: 0, fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>{isEditing ? "Edit blog" : "Create blog"}</h2>
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

        <div className="grid" style={{ gap: "0.8rem" }}>
          {blogs.map((blog) => (
            <article key={blog.id} className="card card-pad" style={{ display: "grid", gap: "0.6rem" }}>
              <div className="meta-row" style={{ justifyContent: "space-between" }}>
                <div>
                  <strong>{blog.title}</strong>
                  <p style={{ margin: 0, color: "var(--text-soft)" }}>/blog/{blog.slug}</p>
                </div>
                <div className="button-row">
                  <button className="button button-secondary" onClick={() => onEdit(blog)}>Edit</button>
                  <button className="button button-secondary" onClick={() => void remove(blog.slug)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
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

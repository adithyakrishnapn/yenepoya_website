export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  createdAt: string;
  updatedAt?: string;
  status: "published" | "draft";
};

export type BlogPayload = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  status?: "published" | "draft";
};

const sampleBlogs: BlogPost[] = [
  {
    id: "sample-1",
    slug: "why-mudipu-is-growing-as-a-student-destination",
    title: "Why Mudipu Is Growing as a Student Destination",
    excerpt: "Discover how campus culture, academic support, and a future-focused environment are shaping Mudipu into a stronger destination for higher education.",
    category: "Campus Life",
    content: "<p>Mudipu is becoming a practical choice for students who want academic focus, community support, and a calm learning environment.</p><p>At Yenepoya University Mudipu, emphasis is on career-ready learning, strong mentoring, and a modern campus experience.</p>",
    image: "https://mudipu.yenepoyauniversity.online/assets/hero_campus_banner.png",
    seoTitle: "Why Mudipu Is Growing as a Student Destination | Yenepoya University Mudipu",
    seoDescription: "Learn why Mudipu is becoming a preferred destination for students seeking higher education, campus support, and future-ready learning.",
    seoKeywords: ["Mudipu student destination", "Yenepoya University Mudipu", "higher education campus"],
    createdAt: "2026-03-25T10:00:00.000Z",
    updatedAt: "2026-03-25T10:00:00.000Z",
    status: "published"
  },
  {
    id: "sample-2",
    slug: "how-to-choose-the-right-degree-program",
    title: "How to Choose the Right Degree Program",
    excerpt: "A practical guide for students comparing degree options, academic goals, and long-term employability.",
    category: "Admissions",
    content: "<p>Choosing a degree program should start with your strengths, interests, and the kind of work you want to do after graduation.</p><p>Look at curriculum depth, internship support, faculty expertise, and industry relevance before deciding.</p>",
    image: "https://mudipu.yenepoyauniversity.online/assets/banner_about.png",
    seoTitle: "How to Choose the Right Degree Program | Yenepoya University Mudipu",
    seoDescription: "Use this guide to compare degree programs and choose the course that fits your career goals, interests, and future opportunities.",
    seoKeywords: ["degree program selection", "university admissions", "career planning"],
    createdAt: "2026-03-20T09:30:00.000Z",
    updatedAt: "2026-03-20T09:30:00.000Z",
    status: "published"
  }
];

type FirestoreValue = {
  stringValue?: string;
  timestampValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
};

type RestDoc = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
};

function readString(fields: Record<string, FirestoreValue>, key: string) {
  return fields[key]?.stringValue ?? "";
}

function readDate(fields: Record<string, FirestoreValue>, key: string) {
  const value = fields[key]?.timestampValue;
  if (!value) return undefined;
  return value;
}

function readStringArray(fields: Record<string, FirestoreValue>, key: string) {
  const values = fields[key]?.arrayValue?.values ?? [];
  return values.map((item) => item.stringValue).filter((item): item is string => Boolean(item));
}

function mapRestDoc(doc: RestDoc): BlogPost | null {
  const fields = doc.fields ?? {};
  const name = doc.name ?? "";
  const id = name.split("/").pop() ?? "";

  const title = readString(fields, "title");
  const slug = readString(fields, "slug");
  const excerpt = readString(fields, "excerpt");
  const content = readString(fields, "content") || readString(fields, "htmlContent");

  if (!id || !title || !slug || !excerpt || !content) {
    return null;
  }

  return {
    id,
    title,
    slug,
    excerpt,
    content,
    image: readString(fields, "image") || readString(fields, "coverImage") || "https://mudipu.yenepoyauniversity.online/assets/hero_campus_banner.png",
    category: readString(fields, "category") || "Insights",
    seoTitle: readString(fields, "seoTitle") || title,
    seoDescription: readString(fields, "seoDescription") || excerpt,
    seoKeywords: readStringArray(fields, "seoKeywords"),
    createdAt: readDate(fields, "createdAt") || readDate(fields, "publishedAt") || new Date().toISOString(),
    updatedAt: readDate(fields, "updatedAt"),
    status: readString(fields, "status") === "draft" ? "draft" : "published"
  };
}

async function fetchRestBlogs(): Promise<BlogPost[]> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!projectId || !apiKey) {
    return sampleBlogs;
  }

  try {
    const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/blogs?key=${apiKey}`;
    const response = await fetch(endpoint, { cache: "no-store" });

    if (!response.ok) {
      return sampleBlogs;
    }

    const json = (await response.json()) as { documents?: RestDoc[] };
    const blogs = (json.documents ?? [])
      .map((doc) => mapRestDoc(doc))
      .filter((blog): blog is BlogPost => Boolean(blog));

    if (!blogs.length) {
      return sampleBlogs;
    }

    return blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return sampleBlogs;
  }
}

export function validateBlogPayload(payload: unknown, partial = false) {
  const body = (payload ?? {}) as Partial<BlogPayload>;
  const errors: string[] = [];

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "Admissions";
  const seoTitle = typeof body.seoTitle === "string" && body.seoTitle.trim() ? body.seoTitle.trim() : title;
  const seoDescription = typeof body.seoDescription === "string" && body.seoDescription.trim() ? body.seoDescription.trim() : excerpt;
  const seoKeywords = Array.isArray(body.seoKeywords)
    ? body.seoKeywords.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
  const status = body.status === "draft" ? "draft" : "published";

  if (!partial || body.title !== undefined) {
    if (!title || title.length < 3) errors.push("title must be at least 3 characters");
  }
  if (!partial || body.slug !== undefined) {
    if (!slug || slug.length < 3) errors.push("slug must be at least 3 characters");
  }
  if (!partial || body.excerpt !== undefined) {
    if (!excerpt || excerpt.length < 10) errors.push("excerpt must be at least 10 characters");
  }
  if (!partial || body.content !== undefined) {
    if (!content || content.length < 20) errors.push("content must be at least 20 characters");
  }
  if (!partial || body.image !== undefined) {
    if (!image) errors.push("image is required");
  }

  return {
    errors,
    value: {
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      seoTitle,
      seoDescription,
      seoKeywords,
      status
    }
  };
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const blogs = await fetchRestBlogs();
  const published = blogs.filter((blog) => blog.status === "published");
  return published.length ? published : sampleBlogs;
}

export async function getAllBlogs(): Promise<BlogPost[]> {
  return fetchRestBlogs();
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const blogs = await fetchRestBlogs();
  return blogs.find((blog) => blog.slug === slug) ?? null;
}

export async function createBlog() {
  throw new Error("Use client Firestore from admin dashboard for create operations");
}

export async function updateBlog() {
  throw new Error("Use client Firestore from admin dashboard for update operations");
}

export async function deleteBlog() {
  throw new Error("Use client Firestore from admin dashboard for delete operations");
}

export async function getBlogSlugs() {
  const blogs = await getPublishedBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

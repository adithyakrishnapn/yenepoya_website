import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getAllBlogs, validateBlogPayload } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!adminDb) {
    const blogs = await getAllBlogs();
    return NextResponse.json({ data: blogs }, { status: 200 });
  }

  try {
    const snap = await adminDb.collection("blogs").get();
    const blogs = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    return NextResponse.json({ data: blogs }, { status: 200 });
  } catch {
    const blogs = await getAllBlogs();
    return NextResponse.json({ data: blogs }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  if (!adminDb) {
    return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { errors, value } = validateBlogPayload(body);

    if (errors.length) {
      return NextResponse.json({ error: errors[0] }, { status: 422 });
    }

    // Check for duplicate slug
    const existing = await adminDb
      .collection("blogs")
      .where("slug", "==", value.slug)
      .get();

    if (!existing.empty) {
      return NextResponse.json({ error: "slug already exists" }, { status: 409 });
    }

    const docRef = await adminDb.collection("blogs").add({
      title: value.title,
      slug: value.slug,
      excerpt: value.excerpt,
      content: value.content,
      image: value.image,
      category: value.category,
      seoTitle: value.seoTitle,
      seoDescription: value.seoDescription,
      seoKeywords: value.seoKeywords,
      status: value.status ?? "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { success: true, data: { id: docRef.id, ...value } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}


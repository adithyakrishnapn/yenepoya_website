import { NextRequest, NextResponse } from "next/server";
import {
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  collection
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { getBlogBySlug, validateBlogPayload } from "@/lib/blogs";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

async function findBlogDoc(slug: string) {
  if (!db) {
    return null;
  }

  const snap = await getDocs(query(collection(db, "blogs"), where("slug", "==", slug)));
  return snap.docs[0] ?? null;
}

export async function GET(_: NextRequest, { params }: Params) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ data: blog }, { status: 200 });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { slug } = await params;

  if (!db) {
    return NextResponse.json({ error: "Firebase Firestore is not configured" }, { status: 500 });
  }

  const currentDoc = await findBlogDoc(slug);
  if (!currentDoc) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  const body = await request.json();
  const { errors, value } = validateBlogPayload(body, true);
  if (errors.length) {
    return NextResponse.json({ error: errors[0] }, { status: 422 });
  }

  const nextSlug = value.slug || slug;
  if (nextSlug !== slug) {
    const duplicateSnap = await getDocs(query(collection(db, "blogs"), where("slug", "==", nextSlug)));
    const hasDuplicate = duplicateSnap.docs.some((entry) => entry.id !== currentDoc.id);
    if (hasDuplicate) {
      return NextResponse.json({ error: "slug already exists" }, { status: 409 });
    }
  }

  await updateDoc(doc(db, "blogs", currentDoc.id), {
    ...value,
    slug: nextSlug,
    updatedAt: serverTimestamp()
  });

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { slug } = await params;

  if (!db) {
    return NextResponse.json({ error: "Firebase Firestore is not configured" }, { status: 500 });
  }

  const currentDoc = await findBlogDoc(slug);
  if (!currentDoc) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  await deleteDoc(doc(db, "blogs", currentDoc.id));

  return NextResponse.json({ success: true }, { status: 200 });
}

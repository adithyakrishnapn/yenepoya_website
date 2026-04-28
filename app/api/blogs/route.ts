import { NextRequest, NextResponse } from "next/server";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { getAllBlogs, validateBlogPayload } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export async function GET() {
  const blogs = await getAllBlogs();
  return NextResponse.json({ data: blogs }, { status: 200 });
}

export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: "Firebase Firestore is not configured" }, { status: 500 });
  }

  const body = await request.json();
  const { errors, value } = validateBlogPayload(body);

  if (errors.length) {
    return NextResponse.json({ error: errors[0] }, { status: 422 });
  }

  const duplicateQuery = query(collection(db, "blogs"), where("slug", "==", value.slug));
  const duplicateSnap = await getDocs(duplicateQuery);
  if (!duplicateSnap.empty) {
    return NextResponse.json({ error: "slug already exists" }, { status: 409 });
  }

  const docRef = await addDoc(collection(db, "blogs"), {
    ...value,
    status: value.status ?? "published",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return NextResponse.json({ success: true, data: { id: docRef.id, ...value } }, { status: 200 });
}

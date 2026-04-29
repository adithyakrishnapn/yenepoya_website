import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { getBlogBySlug, validateBlogPayload } from "@/lib/blogs";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

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

  if (!adminDb) {
    return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 500 });
  }

  try {
    // Find blog by slug
    const snap = await adminDb
      .collection("blogs")
      .where("slug", "==", slug)
      .get();

    if (snap.empty) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const currentDoc = snap.docs[0];
    const body = await request.json();
    const { errors, value } = validateBlogPayload(body, true);

    if (errors.length) {
      return NextResponse.json({ error: errors[0] }, { status: 422 });
    }

    const nextSlug = value.slug || slug;
    if (nextSlug !== slug) {
      const duplicateSnap = await adminDb
        .collection("blogs")
        .where("slug", "==", nextSlug)
        .get();

      if (!duplicateSnap.empty) {
        const hasDifferent = duplicateSnap.docs.some((doc) => doc.id !== currentDoc.id);
        if (hasDifferent) {
          return NextResponse.json({ error: "slug already exists" }, { status: 409 });
        }
      }
    }

    await currentDoc.ref.update({
      ...value,
      slug: nextSlug,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { slug } = await params;

  if (!adminDb) {
    return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 500 });
  }

  try {
    const snap = await adminDb
      .collection("blogs")
      .where("slug", "==", slug)
      .get();

    if (snap.empty) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await snap.docs[0].ref.delete();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}


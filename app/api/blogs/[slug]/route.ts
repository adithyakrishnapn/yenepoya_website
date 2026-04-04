import { NextRequest, NextResponse } from "next/server";
import { getBlogBySlug } from "@/lib/blogs";

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
  void request;
  return NextResponse.json(
    { error: `Use admin dashboard client flow to update blog: ${slug}` },
    { status: 405 }
  );
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  void request;
  return NextResponse.json(
    { error: `Use admin dashboard client flow to delete blog: ${slug}` },
    { status: 405 }
  );
}

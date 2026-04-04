import { NextRequest, NextResponse } from "next/server";
import { getAllBlogs } from "@/lib/blogs";

export const dynamic = "force-dynamic";

export async function GET() {
  const blogs = await getAllBlogs();
  return NextResponse.json({ data: blogs }, { status: 200 });
}

export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    { error: "Use admin dashboard client flow to create blogs." },
    { status: 405 }
  );
}

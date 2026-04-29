import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

type PerformanceEventPayload = {
  kind?: "lead" | "visit";
  source?: string;
  name?: string;
  email?: string;
  phone?: string;
  place?: string;
  course?: string;
  campus?: string;
  blogSlug?: string;
  blogTitle?: string;
  path?: string;
  referrer?: string;
  message?: string;
};

type PerformanceEventRow = {
  id: string;
  createdAt?: string;
} & Record<string, unknown>;

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ error: "Firebase Admin is not configured on server" }, { status: 500 });
  }

  try {
    const snap = await adminDb.collection("performance_events").limit(200).get();

    const data = snap.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Record<string, unknown>)
      }) as PerformanceEventRow)
      .sort((a, b) => {
        const left = typeof a.createdAt === "string" ? a.createdAt : "";
        const right = typeof b.createdAt === "string" ? b.createdAt : "";
        return right.localeCompare(left);
      })
      .slice(0, 100);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read performance events";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!adminDb) {
    return NextResponse.json({ error: "Firebase Admin is not configured on server" }, { status: 500 });
  }

  try {
    const body = (await request.json()) as PerformanceEventPayload;

    await adminDb.collection("performance_events").add({
      kind: body.kind === "lead" ? "lead" : "visit",
      source: body.source?.trim() || "Unknown",
      name: body.name?.trim() || "",
      email: body.email?.trim() || "",
      phone: body.phone?.trim() || "",
      place: body.place?.trim() || "",
      course: body.course?.trim() || "",
      campus: body.campus?.trim() || "",
      blogSlug: body.blogSlug?.trim() || "",
      blogTitle: body.blogTitle?.trim() || "",
      path: body.path?.trim() || "",
      referrer: body.referrer?.trim() || "",
      message: body.message?.trim() || "",
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to write performance event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


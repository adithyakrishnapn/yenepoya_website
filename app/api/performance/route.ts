import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ data: [] }, { status: 200 });
  }

  try {
    const snap = await adminDb
      .collection("performance_events")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  if (!adminDb) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  try {
    const body = await request.json();

    await adminDb.collection("performance_events").add({
      kind: body.kind ?? "visit",
      source: body.source ?? "Unknown",
      name: body.name ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      place: body.place ?? "",
      course: body.course ?? "",
      campus: body.campus ?? "",
      blogSlug: body.blogSlug ?? "",
      blogTitle: body.blogTitle ?? "",
      path: body.path ?? "",
      referrer: body.referrer ?? "",
      message: body.message ?? "",
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ success: true }, { status: 200 });
  }
}


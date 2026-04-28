import { NextRequest, NextResponse } from "next/server";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

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

type PerformanceEventRecord = PerformanceEventPayload & {
  id: string;
  createdAt: string;
};

function toIsoTimestamp(value: unknown) {
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate?: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return new Date().toISOString();
}

export async function GET() {
  if (!db) {
    return NextResponse.json({ data: [] as PerformanceEventRecord[] }, { status: 200 });
  }

  try {
    const snap = await getDocs(query(collection(db, "performance_events"), orderBy("createdAt", "desc"), limit(100)));
    const data = snap.docs.map((item) => {
      const raw = item.data() as Record<string, unknown>;

      return {
        id: item.id,
        kind: raw.kind === "visit" ? "visit" : "lead",
        source: typeof raw.source === "string" ? raw.source : "Unknown source",
        name: typeof raw.name === "string" ? raw.name : "",
        email: typeof raw.email === "string" ? raw.email : "",
        phone: typeof raw.phone === "string" ? raw.phone : "",
        place: typeof raw.place === "string" ? raw.place : "",
        course: typeof raw.course === "string" ? raw.course : "",
        campus: typeof raw.campus === "string" ? raw.campus : "",
        blogSlug: typeof raw.blogSlug === "string" ? raw.blogSlug : "",
        blogTitle: typeof raw.blogTitle === "string" ? raw.blogTitle : "",
        path: typeof raw.path === "string" ? raw.path : "",
        referrer: typeof raw.referrer === "string" ? raw.referrer : "",
        message: typeof raw.message === "string" ? raw.message : "",
        createdAt: toIsoTimestamp(raw.createdAt)
      };
    }) as PerformanceEventRecord[];

    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json({ data: [] as PerformanceEventRecord[] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const body = (await request.json()) as PerformanceEventPayload;
  const kind = body.kind === "visit" ? "visit" : "lead";
  const source = body.source?.trim() || "Unknown source";

  try {
    await addDoc(collection(db, "performance_events"), {
      kind,
      source,
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
      createdAt: serverTimestamp()
    });
  } catch {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

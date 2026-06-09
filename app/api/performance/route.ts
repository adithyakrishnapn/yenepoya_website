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
    // 1. Fetch the latest 100 events for the live feed (no where clause, just orderBy to avoid index issues)
    const latestEventsSnap = await adminDb.collection("performance_events")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();

    const latestEvents = latestEventsSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>)
    }));

    // 2. Count total visits (using Firestore count aggregation, extremely fast and cost-effective)
    const visitsCountSnap = await adminDb.collection("performance_events")
      .where("kind", "==", "visit")
      .count()
      .get();
    const totalVisits = visitsCountSnap.data().count;

    // 3. Fetch all lead events to calculate total leads, unique contacts, and top lead sources
    const leadEventsSnap = await adminDb.collection("performance_events")
      .where("kind", "==", "lead")
      .get();
    
    const leadEvents = leadEventsSnap.docs.map(doc => doc.data() as PerformanceEventPayload);
    const totalLeads = leadEvents.length;

    const uniqueContacts = new Set(
      leadEvents.map((event) => event.email || event.phone || event.name || event.source)
    ).size;

    const leadSources = leadEvents.reduce<Record<string, number>>((accumulator, event) => {
      const source = event.source?.trim() || "Unknown";
      accumulator[source] = (accumulator[source] ?? 0) + 1;
      return accumulator;
    }, {});
    const topLeadSources = Object.entries(leadSources)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4);

    // 4. Fetch up to 5000 visits to compute top visited blogs (no orderBy to avoid index requirements)
    const visitsSnap = await adminDb.collection("performance_events")
      .where("kind", "==", "visit")
      .limit(5000)
      .get();
    
    const visitEvents = visitsSnap.docs.map(doc => doc.data() as PerformanceEventPayload);
    const topVisitedBlogs = visitEvents.reduce<Record<string, number>>((accumulator, event) => {
      const key = event.blogTitle?.trim() || event.blogSlug?.trim() || event.path?.trim() || event.source?.trim() || "Unknown";
      accumulator[key] = (accumulator[key] ?? 0) + 1;
      return accumulator;
    }, {});
    const topVisitedBlogEntries = Object.entries(topVisitedBlogs)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5);

    return NextResponse.json({
      data: latestEvents,
      stats: {
        totalVisits,
        totalLeads,
        uniqueContacts,
        topLeadSources,
        topVisitedBlogEntries
      }
    }, { status: 200 });
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


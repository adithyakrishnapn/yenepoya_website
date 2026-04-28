import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "performance-events.json");

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

async function readStore() {
  try {
    const raw = await readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as PerformanceEventRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as PerformanceEventRecord[];
  }
}

async function writeStore(events: PerformanceEventRecord[]) {
  await mkdir(STORE_DIR, { recursive: true });
  await writeFile(STORE_FILE, JSON.stringify(events, null, 2), "utf8");
}

export async function GET() {
  try {
    const data = await readStore();

    return NextResponse.json({ data: data.slice().sort((left, right) => right.createdAt.localeCompare(left.createdAt)).slice(0, 100) }, { status: 200 });
  } catch {
    return NextResponse.json({ data: [] as PerformanceEventRecord[] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PerformanceEventPayload;
  const kind = body.kind === "visit" ? "visit" : "lead";
  const source = body.source?.trim() || "Unknown source";

  try {
    const nextEvent: PerformanceEventRecord = {
      id: randomUUID(),
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
      createdAt: new Date().toISOString()
    };

    const existing = await readStore();
    await writeStore([nextEvent, ...existing]);
  } catch {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

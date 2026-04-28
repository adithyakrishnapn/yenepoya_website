"use client";

import { addDoc, collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export type PerformanceEventKind = "lead" | "visit";

export type PerformanceEventInput = {
  kind: PerformanceEventKind;
  source: string;
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

export type PerformanceEventRecord = PerformanceEventInput & {
  id: string;
  createdAt: string;
};

export async function recordPerformanceEvent(input: PerformanceEventInput) {
  if (!db) {
    return null;
  }

  try {
    await addDoc(collection(db, "performance_events"), {
      kind: input.kind,
      source: input.source,
      name: input.name ?? "",
      email: input.email ?? "",
      phone: input.phone ?? "",
      place: input.place ?? "",
      course: input.course ?? "",
      campus: input.campus ?? "",
      blogSlug: input.blogSlug ?? "",
      blogTitle: input.blogTitle ?? "",
      path: input.path ?? "",
      referrer: input.referrer ?? "",
      message: input.message ?? "",
      createdAt: new Date().toISOString()
    });
  } catch {
    return null;
  }
}

export async function fetchPerformanceEvents() {
  if (!db) {
    return [] as PerformanceEventRecord[];
  }

  try {
    const snap = await getDocs(query(collection(db, "performance_events"), orderBy("createdAt", "desc"), limit(100)));
    return snap.docs.map((item) => {
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
        createdAt: typeof raw.createdAt === "string" ? raw.createdAt : new Date().toISOString()
      } satisfies PerformanceEventRecord;
    });
  } catch {
    return [] as PerformanceEventRecord[];
  }
}
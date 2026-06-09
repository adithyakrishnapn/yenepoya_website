"use client";

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

type ApiError = { error?: string };

export async function recordPerformanceEvent(input: PerformanceEventInput) {
  try {
    const response = await fetch("/api/performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as ApiError;
      throw new Error(data.error ?? "Failed to record performance event");
    }
  } catch (error) {
    console.error("recordPerformanceEvent failed:", error);
    return null;
  }
}

export type PerformanceStats = {
  totalVisits: number;
  totalLeads: number;
  uniqueContacts: number;
  topLeadSources: [string, number][];
  topVisitedBlogEntries: [string, number][];
};

export async function fetchPerformanceEvents() {
  try {
    const response = await fetch("/api/performance", { cache: "no-store" });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as ApiError;
      throw new Error(data.error ?? "Failed to fetch performance events");
    }

    const json = (await response.json()) as {
      data?: PerformanceEventRecord[];
      stats?: PerformanceStats;
    };

    return {
      events: json.data ?? [],
      stats: json.stats ?? {
        totalVisits: 0,
        totalLeads: 0,
        uniqueContacts: 0,
        topLeadSources: [],
        topVisitedBlogEntries: []
      }
    };
  } catch (error) {
    console.error("fetchPerformanceEvents failed:", error);
    throw error;
  }
}
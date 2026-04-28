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

export async function recordPerformanceEvent(input: PerformanceEventInput) {
  try {
    await fetch("/api/performance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });
  } catch {
    return null;
  }
}

export async function fetchPerformanceEvents() {
  try {
    const response = await fetch("/api/performance", {
      method: "GET",
      cache: "no-store"
    });

    if (!response.ok) {
      return [] as PerformanceEventRecord[];
    }

    const data = (await response.json()) as { data?: PerformanceEventRecord[] };
    return data.data ?? [];
  } catch {
    return [] as PerformanceEventRecord[];
  }
}
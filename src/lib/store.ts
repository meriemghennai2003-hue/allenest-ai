// Lightweight client-side store using localStorage. Easy to swap to Cloud later.
export type Child = {
  id: string;
  name: string;
  birthdate: string;
  gender: "male" | "female";
  feeding: "breast" | "formula" | "mixed" | "solid";
  allergies: string[];
  avatar?: string;
};

export type Entry = {
  id: string;
  food: string;
  symptoms: string[];
  severity: number; // 0-100
  notes?: string;
  timestamp: number;
};

export type DoctorVisit = {
  id: string;
  date: string;
  doctor: string;
  notes: string;
  prescription?: string;
};

export type DailyLog = {
  id: string;
  date: string; // YYYY-MM-DD
  temperature?: number; // °C
  mood: "happy" | "ok" | "sad" | "sick";
  sleepHours?: number;
  symptoms: string[];
  medication?: string;
  notes?: string;
  timestamp: number;
};

const KEYS = {
  child: "an.child",
  entries: "an.entries",
  visits: "an.visits",
  onboarded: "an.onboarded",
  daily: "an.daily",
  shareCode: "an.shareCode",
};

const safe = <T,>(k: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const store = {
  getChild: () => safe<Child | null>(KEYS.child, null),
  setChild: (c: Child) => localStorage.setItem(KEYS.child, JSON.stringify(c)),
  getEntries: () => safe<Entry[]>(KEYS.entries, []),
  addEntry: (e: Entry) => {
    const list = [e, ...store.getEntries()];
    localStorage.setItem(KEYS.entries, JSON.stringify(list));
    return list;
  },
  getVisits: () => safe<DoctorVisit[]>(KEYS.visits, []),
  addVisit: (v: DoctorVisit) => {
    const list = [v, ...store.getVisits()];
    localStorage.setItem(KEYS.visits, JSON.stringify(list));
    return list;
  },
  isOnboarded: () => safe<boolean>(KEYS.onboarded, false),
  setOnboarded: (v: boolean) => localStorage.setItem(KEYS.onboarded, JSON.stringify(v)),
  getDaily: () => safe<DailyLog[]>(KEYS.daily, []),
  addDaily: (d: DailyLog) => {
    const list = [d, ...store.getDaily()];
    localStorage.setItem(KEYS.daily, JSON.stringify(list));
    return list;
  },
  removeDaily: (id: string) => {
    const list = store.getDaily().filter((x) => x.id !== id);
    localStorage.setItem(KEYS.daily, JSON.stringify(list));
    return list;
  },
  getOrCreateShareCode: () => {
    const existing = safe<string | null>(KEYS.shareCode, null);
    if (existing) return existing;
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    if (typeof window !== "undefined") localStorage.setItem(KEYS.shareCode, JSON.stringify(code));
    return code;
  },
};

// Simple rule-based "AI" insights
export function computeInsights(entries: Entry[]) {
  if (!entries.length) return null;
  const foodCount: Record<string, { count: number; severity: number }> = {};
  for (const e of entries) {
    if (!foodCount[e.food]) foodCount[e.food] = { count: 0, severity: 0 };
    foodCount[e.food].count += 1;
    foodCount[e.food].severity += e.severity;
  }
  const ranked = Object.entries(foodCount)
    .map(([food, v]) => ({ food, count: v.count, avg: v.severity / v.count }))
    .sort((a, b) => b.count * b.avg - a.count * a.avg);
  const top = ranked[0];
  if (!top) return null;
  const risk = top.avg > 66 ? "high" : top.avg > 33 ? "med" : "low";
  const confidence = Math.min(95, 40 + top.count * 12);
  return { topFood: top.food, risk, pattern: top.count >= 2, confidence: Math.round(confidence) };
}

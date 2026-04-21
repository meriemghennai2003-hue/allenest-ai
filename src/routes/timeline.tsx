import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Download, Share2, Plus, Thermometer, Smile, Frown, Meh, Bed, Pill, Trash2, Stethoscope } from "lucide-react";
import { ScreenHeader, MobileShell } from "@/components/ui-kit/Layout";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { PrimaryButton } from "@/components/ui-kit/PrimaryButton";
import { BottomTabBar } from "@/components/ui-kit/BottomTabBar";
import { store, type DailyLog, type Entry } from "@/lib/store";
import { downloadReport, shareReport } from "@/lib/pdfReport";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/timeline")({ component: Timeline });

const MOODS: Array<{ key: DailyLog["mood"]; icon: React.ComponentType<{ size?: number }>; color: string }> = [
  { key: "happy", icon: Smile, color: "bg-success/20 text-success" },
  { key: "ok", icon: Meh, color: "bg-warning/20 text-warning" },
  { key: "sad", icon: Frown, color: "bg-warning/20 text-warning" },
  { key: "sick", icon: Thermometer, color: "bg-destructive/20 text-destructive" },
];

function Timeline() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [daily, setDaily] = useState<DailyLog[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // form state
  const today = format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState(today);
  const [temp, setTemp] = useState("");
  const [mood, setMood] = useState<DailyLog["mood"]>("happy");
  const [sleep, setSleep] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [med, setMed] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setEntries(store.getEntries());
    setDaily(store.getDaily());
  }, []);

  // group by day
  const grouped = useMemo(() => {
    const map = new Map<string, { logs: DailyLog[]; events: Entry[] }>();
    for (const d of daily) {
      const k = d.date;
      if (!map.has(k)) map.set(k, { logs: [], events: [] });
      map.get(k)!.logs.push(d);
    }
    for (const e of entries) {
      const k = format(e.timestamp, "yyyy-MM-dd");
      if (!map.has(k)) map.set(k, { logs: [], events: [] });
      map.get(k)!.events.push(e);
    }
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [daily, entries]);

  const toggleSym = (s: string) =>
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const save = () => {
    const log: DailyLog = {
      id: crypto.randomUUID(),
      date,
      temperature: temp ? Number(temp) : undefined,
      mood,
      sleepHours: sleep ? Number(sleep) : undefined,
      symptoms,
      medication: med || undefined,
      notes: notes || undefined,
      timestamp: Date.now(),
    };
    setDaily(store.addDaily(log));
    setOpen(false);
    setTemp(""); setSleep(""); setSymptoms([]); setMed(""); setNotes(""); setMood("happy");
    toast.success(t("timeline.savedDaily"));
  };

  const remove = (id: string) => {
    setDaily(store.removeDaily(id));
  };

  const reportInput = () => ({
    child: store.getChild(),
    daily: store.getDaily(),
    entries: store.getEntries(),
    visits: store.getVisits(),
    shareCode: store.getOrCreateShareCode(),
  });

  const onDownload = async () => {
    setBusy(true);
    try {
      await downloadReport(reportInput());
      toast.success(t("timeline.pdfReady"));
    } finally { setBusy(false); }
  };

  const onShare = async () => {
    setBusy(true);
    try {
      const ok = await shareReport(reportInput());
      toast.success(ok ? t("timeline.shared") : t("timeline.pdfReady"));
    } finally { setBusy(false); }
  };

  const code = typeof window !== "undefined" ? store.getOrCreateShareCode() : "";

  const symList = ["rash", "itch", "diarrhea", "cough", "swelling", "breath"] as const;

  return (
    <MobileShell>
      <ScreenHeader title={t("timeline.title")} back />
      <div className="px-5 space-y-4">
        {/* Action bar */}
        <SoftCard className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">{t("timeline.report")}</p>
              <p className="text-xs text-muted-foreground">{t("timeline.reportSub")}</p>
            </div>
            <Link
              to="/doctor-portal"
              className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold inline-flex items-center gap-1"
            >
              <Stethoscope size={14} /> {code}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <PrimaryButton variant="ghost" onClick={onDownload} disabled={busy}>
              <Download size={16} /> PDF
            </PrimaryButton>
            <PrimaryButton onClick={onShare} disabled={busy}>
              <Share2 size={16} /> {t("timeline.share")}
            </PrimaryButton>
          </div>
        </SoftCard>

        {/* Add daily log */}
        {open ? (
          <SoftCard className="space-y-3">
            <p className="text-sm font-bold">{t("timeline.newDaily")}</p>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 rounded-2xl bg-muted px-3 text-sm outline-none" />
              <div className="relative">
                <Thermometer size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="36.8" inputMode="decimal" className="h-11 w-full rounded-2xl bg-muted ps-9 pe-3 text-sm outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map(({ key, icon: Icon, color }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMood(key)}
                  className={`h-12 rounded-2xl grid place-items-center transition ${mood === key ? color + " ring-2 ring-current" : "bg-muted text-muted-foreground"}`}
                  aria-label={key}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Bed size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={sleep} onChange={(e) => setSleep(e.target.value)} placeholder={t("timeline.sleep")} inputMode="numeric" className="h-11 w-full rounded-2xl bg-muted ps-9 pe-3 text-sm outline-none" />
              </div>
              <div className="relative">
                <Pill size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={med} onChange={(e) => setMed(e.target.value)} placeholder={t("timeline.medication")} className="h-11 w-full rounded-2xl bg-muted ps-9 pe-3 text-sm outline-none" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {symList.map((s) => {
                const label = t(`track.symptoms.${s}`);
                const active = symptoms.includes(label);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSym(label)}
                    className={`px-3 h-8 rounded-full text-xs transition ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("track.notesPh")} rows={2} className="w-full rounded-2xl bg-muted p-3 text-sm outline-none resize-none" />
            <div className="flex gap-2">
              <PrimaryButton variant="ghost" onClick={() => setOpen(false)} className="flex-1">{t("common.cancel")}</PrimaryButton>
              <PrimaryButton onClick={save} className="flex-1">{t("common.save")}</PrimaryButton>
            </div>
          </SoftCard>
        ) : (
          <PrimaryButton fullWidth onClick={() => setOpen(true)}>
            <Plus size={18} /> {t("timeline.addDaily")}
          </PrimaryButton>
        )}

        {/* Grouped timeline */}
        {grouped.length === 0 ? (
          <SoftCard className="text-center py-12 text-sm text-muted-foreground">{t("timeline.empty")}</SoftCard>
        ) : (
          <div className="space-y-4">
            {grouped.map(([day, { logs, events }]) => {
              const peakSeverity = Math.max(0, ...events.map((e) => e.severity), ...logs.map((l) => l.mood === "sick" ? 80 : l.temperature && l.temperature >= 38.5 ? 70 : 30));
              const dot = peakSeverity > 66 ? "bg-destructive" : peakSeverity > 33 ? "bg-warning" : "bg-success";
              return (
                <div key={day} className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                    <p className="text-xs font-semibold text-muted-foreground">{format(new Date(day), "EEE, MMM d")}</p>
                  </div>
                  {logs.map((l) => (
                    <SoftCard key={l.id} className="py-3">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-muted grid place-items-center shrink-0">
                          {(() => {
                            const m = MOODS.find((x) => x.key === l.mood)!;
                            const Ic = m.icon;
                            return <Ic size={18} />;
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {l.temperature != null && <span>🌡 {l.temperature}°C</span>}
                            {l.sleepHours != null && <span>😴 {l.sleepHours}h</span>}
                            {l.medication && <span>💊 {l.medication}</span>}
                          </div>
                          {l.symptoms.length > 0 && <p className="text-sm font-medium mt-0.5">{l.symptoms.join(" • ")}</p>}
                          {l.notes && <p className="text-xs text-muted-foreground mt-0.5">{l.notes}</p>}
                        </div>
                        <button onClick={() => remove(l.id)} className="text-muted-foreground hover:text-destructive transition" aria-label="delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </SoftCard>
                  ))}
                  {events.map((e) => (
                    <SoftCard key={e.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">{e.food}</p>
                          <p className="text-xs text-muted-foreground">{e.symptoms.join(", ") || "—"}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{format(e.timestamp, "HH:mm")}</span>
                      </div>
                    </SoftCard>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomTabBar />
    </MobileShell>
  );
}

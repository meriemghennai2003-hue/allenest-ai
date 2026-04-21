import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Stethoscope, Download, Copy, FileCheck2 } from "lucide-react";
import { ScreenHeader, MobileShell } from "@/components/ui-kit/Layout";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { PrimaryButton } from "@/components/ui-kit/PrimaryButton";
import { BottomTabBar } from "@/components/ui-kit/BottomTabBar";
import { store, type Child, type DailyLog, type Entry, type DoctorVisit } from "@/lib/store";
import { downloadReport } from "@/lib/pdfReport";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor-portal")({ component: DoctorPortal });

function DoctorPortal() {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [child, setChild] = useState<Child | null>(null);
  const [daily, setDaily] = useState<DailyLog[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [visits, setVisits] = useState<DoctorVisit[]>([]);

  useEffect(() => {
    setCode(store.getOrCreateShareCode());
    setChild(store.getChild());
    setDaily(store.getDaily());
    setEntries(store.getEntries());
    setVisits(store.getVisits());
  }, []);

  const stats = useMemo(() => {
    const fevers = daily.filter((d) => (d.temperature ?? 0) >= 38).length;
    const sickDays = daily.filter((d) => d.mood === "sick").length;
    const allSyms = [...daily.flatMap((d) => d.symptoms), ...entries.flatMap((e) => e.symptoms)];
    const counts: Record<string, number> = {};
    for (const s of allSyms) counts[s] = (counts[s] || 0) + 1;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    return { fevers, sickDays, top };
  }, [daily, entries]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(t("doctorPortal.copied"));
    } catch {
      toast.error("—");
    }
  };

  const onDownload = async () => {
    await downloadReport({ child, daily, entries, visits, shareCode: code });
    toast.success(t("timeline.pdfReady"));
  };

  return (
    <MobileShell>
      <ScreenHeader title={t("doctorPortal.title")} back />
      <div className="px-5 space-y-4">
        <SoftCard className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl gradient-sky grid place-items-center">
              <Stethoscope size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">{t("doctorPortal.shareCode")}</p>
              <p className="text-xs text-muted-foreground">{t("doctorPortal.shareSub")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-12 rounded-2xl bg-muted grid place-items-center font-mono text-lg tracking-[0.3em] font-bold">
              {code}
            </div>
            <button onClick={copy} className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center" aria-label="copy">
              <Copy size={18} />
            </button>
          </div>
        </SoftCard>

        <SoftCard>
          <p className="text-sm font-bold mb-2">{t("doctorPortal.summary")}</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-muted p-3">
              <p className="text-2xl font-bold">{daily.length + entries.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t("doctorPortal.records")}</p>
            </div>
            <div className="rounded-2xl bg-warning/10 p-3">
              <p className="text-2xl font-bold text-warning">{stats.fevers}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t("doctorPortal.fevers")}</p>
            </div>
            <div className="rounded-2xl bg-destructive/10 p-3">
              <p className="text-2xl font-bold text-destructive">{stats.sickDays}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t("doctorPortal.sickDays")}</p>
            </div>
          </div>
          {stats.top.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1.5">{t("doctorPortal.topSymptoms")}</p>
              <div className="flex flex-wrap gap-1.5">
                {stats.top.map(([s, n]) => (
                  <span key={s} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {s} · {n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </SoftCard>

        {child && (
          <SoftCard>
            <p className="text-sm font-bold mb-2">{t("doctorPortal.patient")}</p>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">{t("profile.name")}:</span> {child.name}</p>
              <p><span className="text-muted-foreground">{t("profile.birthdate")}:</span> {child.birthdate}</p>
              <p><span className="text-muted-foreground">{t("profile.allergies")}:</span> {child.allergies.join(", ") || "—"}</p>
            </div>
          </SoftCard>
        )}

        <SoftCard>
          <p className="text-sm font-bold mb-2">{t("doctorPortal.recent")}</p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {[...daily.slice(0, 10)].map((d) => (
              <div key={d.id} className="flex items-start justify-between gap-3 text-xs border-b border-border pb-2 last:border-0">
                <div>
                  <p className="font-semibold">{format(new Date(d.date), "MMM d")}</p>
                  <p className="text-muted-foreground">{d.symptoms.join(", ") || "—"}</p>
                </div>
                <div className="text-right text-muted-foreground">
                  {d.temperature != null && <p>🌡 {d.temperature}°C</p>}
                  {d.medication && <p>💊 {d.medication}</p>}
                </div>
              </div>
            ))}
            {daily.length === 0 && <p className="text-xs text-muted-foreground">—</p>}
          </div>
        </SoftCard>

        <PrimaryButton fullWidth onClick={onDownload}>
          <FileCheck2 size={18} /> <Download size={16} /> {t("doctorPortal.download")}
        </PrimaryButton>
      </div>
      <BottomTabBar />
    </MobileShell>
  );
}

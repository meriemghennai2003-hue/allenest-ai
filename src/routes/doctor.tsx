import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { FileText, Plus, Stethoscope } from "lucide-react";
import { ScreenHeader, MobileShell } from "@/components/ui-kit/Layout";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { PrimaryButton } from "@/components/ui-kit/PrimaryButton";
import { BottomTabBar } from "@/components/ui-kit/BottomTabBar";
import { store, DoctorVisit } from "@/lib/store";

export const Route = createFileRoute("/doctor")({ component: Doctor });

function Doctor() {
  const { t } = useTranslation();
  const [visits, setVisits] = useState<DoctorVisit[]>([]);
  const [open, setOpen] = useState(false);
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => setVisits(store.getVisits()), []);

  const add = () => {
    if (!doctor || !date) return;
    const list = store.addVisit({ id: crypto.randomUUID(), date, doctor, notes });
    setVisits(list);
    setOpen(false);
    setDoctor(""); setDate(""); setNotes("");
  };

  return (
    <MobileShell>
      <ScreenHeader title={t("doctor.title")} back />
      <div className="px-5 space-y-3">
        <h3 className="text-sm font-bold mt-1">{t("doctor.visits")}</h3>
        {visits.length === 0 && (
          <SoftCard className="text-center py-8 text-sm text-muted-foreground">—</SoftCard>
        )}
        {visits.map((v) => (
          <SoftCard key={v.id} className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl gradient-sky grid place-items-center shrink-0">
              <Stethoscope size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{v.date}</p>
              <p className="font-semibold text-sm truncate">{t("doctor.with")} {v.doctor}</p>
              {v.notes && <p className="text-xs text-muted-foreground truncate">{v.notes}</p>}
            </div>
            <FileText className="text-muted-foreground" size={18} />
          </SoftCard>
        ))}

        {open ? (
          <SoftCard className="space-y-3">
            <input value={doctor} onChange={(e) => setDoctor(e.target.value)} placeholder="Dr. Sarah" className="w-full h-11 rounded-2xl bg-muted px-4 text-sm outline-none" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full h-11 rounded-2xl bg-muted px-4 text-sm outline-none" />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("doctor.notes")} rows={2} className="w-full rounded-2xl bg-muted p-3 text-sm outline-none resize-none" />
            <div className="flex gap-2">
              <PrimaryButton variant="ghost" onClick={() => setOpen(false)} className="flex-1">{t("common.cancel")}</PrimaryButton>
              <PrimaryButton onClick={add} className="flex-1">{t("common.save")}</PrimaryButton>
            </div>
          </SoftCard>
        ) : (
          <PrimaryButton fullWidth onClick={() => setOpen(true)}>
            <Plus size={18} /> {t("doctor.addVisit")}
          </PrimaryButton>
        )}
      </div>
      <BottomTabBar />
    </MobileShell>
  );
}

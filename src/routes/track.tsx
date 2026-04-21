import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ScreenHeader, MobileShell } from "@/components/ui-kit/Layout";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { SeveritySlider } from "@/components/ui-kit/SeveritySlider";
import { PrimaryButton } from "@/components/ui-kit/PrimaryButton";
import { BottomTabBar } from "@/components/ui-kit/BottomTabBar";
import { store } from "@/lib/store";

export const Route = createFileRoute("/track")({ component: Track });

function Track() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [food, setFood] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [severity, setSeverity] = useState(50);
  const [notes, setNotes] = useState("");

  const symptoms = [
    { key: "rash", emoji: "🩹" }, { key: "itch", emoji: "💢" }, { key: "diarrhea", emoji: "💧" },
    { key: "cough", emoji: "😷" }, { key: "swelling", emoji: "🫧" }, { key: "breath", emoji: "🌬️" },
  ];

  const toggle = (k: string) =>
    setSelected((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const save = () => {
    if (!food && selected.length === 0) return;
    store.addEntry({
      id: crypto.randomUUID(),
      food: food || "—",
      symptoms: selected.map((s) => t(`track.symptoms.${s}`)),
      severity,
      notes,
      timestamp: Date.now(),
    });
    navigate({ to: "/timeline" });
  };

  return (
    <MobileShell>
      <ScreenHeader title={t("track.title")} back />
      <div className="px-5 space-y-4">
        <SoftCard className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">{t("track.food")}</label>
          <input
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="🥚 Eggs, 🥛 Milk..."
            className="w-full h-12 rounded-2xl bg-muted px-4 text-sm outline-none focus:bg-card border border-transparent focus:border-ring transition"
          />
        </SoftCard>

        <SoftCard className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground">{t("track.symptom")}</label>
          <div className="grid grid-cols-3 gap-2">
            {symptoms.map((s) => {
              const on = selected.includes(s.key);
              return (
                <button
                  key={s.key}
                  onClick={() => toggle(s.key)}
                  className={`rounded-2xl py-3 text-xs font-semibold border transition ${
                    on ? "gradient-pink text-pink-foreground border-transparent shadow-pink" : "bg-muted border-transparent"
                  }`}
                >
                  <div className="text-xl mb-1">{s.emoji}</div>
                  {t(`track.symptoms.${s.key}`)}
                </button>
              );
            })}
          </div>
        </SoftCard>

        <SoftCard className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground">{t("track.severity")}</label>
          <SeveritySlider value={severity} onChange={setSeverity} />
        </SoftCard>

        <SoftCard className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">{t("track.notes")}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("track.notesPh")}
            rows={3}
            className="w-full rounded-2xl bg-muted p-3 text-sm outline-none focus:bg-card border border-transparent focus:border-ring transition resize-none"
          />
        </SoftCard>

        <PrimaryButton fullWidth size="lg" onClick={save}>
          {t("track.saveEntry")}
        </PrimaryButton>
      </div>
      <BottomTabBar />
    </MobileShell>
  );
}

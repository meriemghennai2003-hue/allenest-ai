import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ScreenHeader, MobileShell } from "@/components/ui-kit/Layout";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { BottomTabBar } from "@/components/ui-kit/BottomTabBar";
import { store } from "@/lib/store";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/timeline")({ component: Timeline });

function Timeline() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<ReturnType<typeof store.getEntries>>([]);
  useEffect(() => setEntries(store.getEntries()), []);

  return (
    <MobileShell>
      <ScreenHeader title={t("timeline.title")} back />
      <div className="px-5">
        {entries.length === 0 ? (
          <SoftCard className="text-center py-12 text-sm text-muted-foreground">{t("timeline.empty")}</SoftCard>
        ) : (
          <ol className="relative ms-3 ps-4 border-s-2 border-dashed border-border space-y-3">
            {entries.map((e) => {
              const dot = e.severity > 66 ? "bg-destructive" : e.severity > 33 ? "bg-warning" : "bg-success";
              return (
                <li key={e.id} className="relative">
                  <span className={`absolute -start-[22px] top-3 h-3 w-3 rounded-full ${dot} ring-4 ring-background`} />
                  <SoftCard className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{e.food}</p>
                        <p className="text-xs text-muted-foreground">{e.symptoms.join(", ") || "—"}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{format(e.timestamp, "MMM d • HH:mm")}</span>
                    </div>
                  </SoftCard>
                </li>
              );
            })}
          </ol>
        )}
      </div>
      <BottomTabBar />
    </MobileShell>
  );
}

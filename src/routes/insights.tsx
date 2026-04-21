import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import { ScreenHeader, MobileShell } from "@/components/ui-kit/Layout";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { BottomTabBar } from "@/components/ui-kit/BottomTabBar";
import { computeInsights, store } from "@/lib/store";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/insights")({ component: Insights });

function Insights() {
  const { t } = useTranslation();
  const [data, setData] = useState<ReturnType<typeof computeInsights>>(null);
  useEffect(() => {
    setData(computeInsights(store.getEntries()));
  }, []);

  const riskColor = data?.risk === "high" ? "gradient-alert text-destructive-foreground"
    : data?.risk === "med" ? "bg-warning text-warning-foreground" : "bg-success text-success-foreground";

  return (
    <MobileShell>
      <ScreenHeader title={t("insights.title")} back />
      <div className="px-5 space-y-3">
        {!data ? (
          <SoftCard className="text-center py-12 text-sm text-muted-foreground">
            {t("home.noActivity")}
          </SoftCard>
        ) : (
          <>
            <SoftCard className={`${riskColor} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/30 grid place-items-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="text-xs opacity-80">{t("insights.risk")}</p>
                  <p className="font-bold">{t(`insights.${data.risk}`)}</p>
                </div>
              </div>
            </SoftCard>

            <SoftCard className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("insights.cause")}</span>
              <span className="font-semibold">{data.topFood}</span>
            </SoftCard>

            <SoftCard className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("insights.pattern")}</span>
              <span className={`font-semibold ${data.pattern ? "text-destructive" : "text-success"}`}>
                {data.pattern ? t("insights.yes") : t("insights.no")}
              </span>
            </SoftCard>

            <SoftCard>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{t("insights.confidence")}</span>
                <span className="font-bold">{data.confidence}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${data.confidence}%` }} />
              </div>
            </SoftCard>

            <SoftCard className="bg-secondary/40 flex items-start gap-3">
              <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={20} />
              <p className="text-sm">{t("insights.advice")}</p>
            </SoftCard>

            <SoftCard className="flex items-center gap-3">
              <TrendingUp className="text-primary" size={20} />
              <p className="text-xs text-muted-foreground">{t("insights.correlation")}</p>
            </SoftCard>
          </>
        )}
      </div>
      <BottomTabBar />
    </MobileShell>
  );
}

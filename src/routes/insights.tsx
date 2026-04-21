import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AlertTriangle, TrendingUp, CheckCircle2, Sparkles, Loader2, Lightbulb } from "lucide-react";
import { ScreenHeader, MobileShell } from "@/components/ui-kit/Layout";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { BottomTabBar } from "@/components/ui-kit/BottomTabBar";
import { PrimaryButton } from "@/components/ui-kit/PrimaryButton";
import { computeInsights, store } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/insights")({ component: Insights });

type AIResult = {
  topFood: string;
  risk: "low" | "med" | "high";
  pattern: boolean;
  confidence: number;
  summary: string;
  tips: string[];
};

function Insights() {
  const { t, i18n } = useTranslation();
  const [base, setBase] = useState<ReturnType<typeof computeInsights>>(null);
  const [ai, setAi] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasEntries, setHasEntries] = useState(false);

  useEffect(() => {
    const entries = store.getEntries();
    setHasEntries(entries.length > 0);
    setBase(computeInsights(entries));
  }, []);

  const runAI = async () => {
    const entries = store.getEntries();
    if (!entries.length) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-insights", {
        body: { entries, child: store.getChild(), language: i18n.language },
      });
      if (error) throw error;
      if (data?.error === "rate_limit") {
        toast.error(t("insights.rateLimit"));
      } else if (data?.error === "payment_required") {
        toast.error(t("insights.paymentRequired"));
      } else if (data?.error) {
        toast.error(t("insights.aiError"));
      } else {
        setAi(data as AIResult);
      }
    } catch (e) {
      console.error(e);
      toast.error(t("insights.aiError"));
    } finally {
      setLoading(false);
    }
  };

  const view = ai ?? (base ? { ...base, summary: "", tips: [] as string[] } : null);
  const riskColor = view?.risk === "high"
    ? "gradient-alert text-destructive-foreground"
    : view?.risk === "med"
    ? "bg-warning text-warning-foreground"
    : "bg-success text-success-foreground";

  return (
    <MobileShell>
      <ScreenHeader title={t("insights.title")} back />
      <div className="px-5 space-y-3">
        {!hasEntries ? (
          <SoftCard className="text-center py-12 text-sm text-muted-foreground">
            {t("home.noActivity")}
          </SoftCard>
        ) : (
          <>
            <PrimaryButton onClick={runAI} disabled={loading} className="w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  {t("insights.analyzing")}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={18} />
                  {ai ? t("insights.retry") : t("insights.analyze")}
                </span>
              )}
            </PrimaryButton>

            {view && (
              <>
                <SoftCard className={`${riskColor} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-white/30 grid place-items-center">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="text-xs opacity-80">{t("insights.risk")}</p>
                      <p className="font-bold">{t(`insights.${view.risk}`)}</p>
                    </div>
                  </div>
                </SoftCard>

                <SoftCard className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("insights.cause")}</span>
                  <span className="font-semibold">{view.topFood}</span>
                </SoftCard>

                <SoftCard className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("insights.pattern")}</span>
                  <span className={`font-semibold ${view.pattern ? "text-destructive" : "text-success"}`}>
                    {view.pattern ? t("insights.yes") : t("insights.no")}
                  </span>
                </SoftCard>

                <SoftCard>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{t("insights.confidence")}</span>
                    <span className="font-bold">{view.confidence}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full transition-all"
                      style={{ width: `${view.confidence}%` }}
                    />
                  </div>
                </SoftCard>

                {ai?.summary && (
                  <SoftCard className="bg-secondary/40 flex items-start gap-3">
                    <Sparkles className="text-primary shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        {t("insights.summary")}
                      </p>
                      <p className="text-sm leading-relaxed">{ai.summary}</p>
                    </div>
                  </SoftCard>
                )}

                {ai?.tips && ai.tips.length > 0 && (
                  <SoftCard>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="text-primary" size={20} />
                      <p className="font-semibold text-sm">{t("insights.tips")}</p>
                    </div>
                    <ul className="space-y-2">
                      {ai.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </SoftCard>
                )}

                {!ai && (
                  <SoftCard className="bg-secondary/40 flex items-start gap-3">
                    <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={20} />
                    <p className="text-sm">{t("insights.advice")}</p>
                  </SoftCard>
                )}

                <SoftCard className="flex items-center gap-3">
                  <TrendingUp className="text-primary" size={20} />
                  <p className="text-xs text-muted-foreground">{t("insights.correlation")}</p>
                </SoftCard>

                <p className="text-[11px] text-center text-muted-foreground px-4 pt-2">
                  {t("insights.disclaimer")}
                </p>
              </>
            )}
          </>
        )}
      </div>
      <BottomTabBar />
    </MobileShell>
  );
}

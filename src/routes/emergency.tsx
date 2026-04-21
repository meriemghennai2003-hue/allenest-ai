import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Phone, Heart } from "lucide-react";
import { ScreenHeader, MobileShell } from "@/components/ui-kit/Layout";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { PrimaryButton } from "@/components/ui-kit/PrimaryButton";
import { BottomTabBar } from "@/components/ui-kit/BottomTabBar";

export const Route = createFileRoute("/emergency")({ component: Emergency });

function Emergency() {
  const { t } = useTranslation();
  return (
    <MobileShell>
      <ScreenHeader title={t("emergency.title")} back />
      <div className="px-5 space-y-4">
        <div className="rounded-3xl gradient-alert text-destructive-foreground p-6 shadow-card text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-white/25 grid place-items-center mb-3 animate-pulse">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-extrabold">{t("emergency.urgent")}</h2>
          <p className="text-sm opacity-90 mt-1">{t("emergency.sub")}</p>
        </div>

        <SoftCard className="space-y-3">
          <h3 className="font-bold text-sm">{t("emergency.signs")}</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-destructive" />{t("emergency.s1")}</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-destructive" />{t("emergency.s2")}</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-destructive" />{t("emergency.s3")}</li>
          </ul>
        </SoftCard>

        <a href="tel:14" className="block">
          <PrimaryButton variant="danger" size="lg" fullWidth>
            <Phone size={20} /> {t("emergency.call")}
          </PrimaryButton>
        </a>

        <SoftCard className="bg-pink/30 flex gap-3">
          <Heart className="text-destructive shrink-0" size={20} />
          <div>
            <p className="font-semibold text-sm">{t("emergency.aid")}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("emergency.aidText")}</p>
          </div>
        </SoftCard>
      </div>
      <BottomTabBar />
    </MobileShell>
  );
}

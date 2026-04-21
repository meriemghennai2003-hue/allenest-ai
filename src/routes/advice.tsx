import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { BookOpen, Shield, AlertCircle, ChevronRight } from "lucide-react";
import { ScreenHeader, MobileShell } from "@/components/ui-kit/Layout";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { BottomTabBar } from "@/components/ui-kit/BottomTabBar";

export const Route = createFileRoute("/advice")({ component: Advice });

function Advice() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const items = [
    { icon: BookOpen, t: t("adviceC.a1"), d: t("adviceC.a1d"), grad: "gradient-pink", color: "text-pink-foreground" },
    { icon: Shield, t: t("adviceC.a2"), d: t("adviceC.a2d"), grad: "gradient-sky", color: "text-foreground" },
    { icon: AlertCircle, t: t("adviceC.a3"), d: t("adviceC.a3d"), grad: "bg-[color:var(--peach)]", color: "text-foreground" },
  ];
  return (
    <MobileShell>
      <ScreenHeader title={t("adviceC.title")} back />
      <div className="px-5 space-y-3">
        {items.map((it, i) => (
          <SoftCard key={i} className="flex items-center gap-3 hover:scale-[1.01] transition cursor-pointer">
            <div className={`h-12 w-12 rounded-2xl ${it.grad} ${it.color} grid place-items-center shrink-0`}>
              <it.icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{it.t}</p>
              <p className="text-xs text-muted-foreground truncate">{it.d}</p>
            </div>
            <ChevronRight className="text-muted-foreground" size={18} style={{ transform: isRTL ? "rotate(180deg)" : "" }} />
          </SoftCard>
        ))}
      </div>
      <BottomTabBar />
    </MobileShell>
  );
}

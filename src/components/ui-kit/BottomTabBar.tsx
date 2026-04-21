import { Link, useLocation } from "@tanstack/react-router";
import { Home, Clock, Brain, Lightbulb, Settings as SettingsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function BottomTabBar() {
  const { t } = useTranslation();
  const loc = useLocation();
  const tabs = [
    { to: "/home", icon: Home, label: t("tabs.home") },
    { to: "/timeline", icon: Clock, label: t("tabs.timeline") },
    { to: "/insights", icon: Brain, label: t("tabs.insights") },
    { to: "/advice", icon: Lightbulb, label: t("tabs.advice") },
    { to: "/settings", icon: SettingsIcon, label: t("tabs.settings") },
  ] as const;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 pointer-events-none">
      <div className="mx-auto max-w-md glass-card rounded-3xl shadow-card pointer-events-auto px-2 py-2 flex justify-around items-center">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = loc.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all min-w-0",
                active ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon size={20} />
              <span className={cn("text-[10px] font-medium truncate", active && "font-semibold")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

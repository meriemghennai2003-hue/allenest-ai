import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Search, Activity, Brain, Siren, Lightbulb, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { MobileShell } from "@/components/ui-kit/Layout";
import { BottomTabBar } from "@/components/ui-kit/BottomTabBar";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { store } from "@/lib/store";
import { useEffect, useState } from "react";
import babyMascot from "@/assets/baby-mascot.png";
import { format } from "date-fns";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const { t } = useTranslation();
  const [child, setChild] = useState<ReturnType<typeof store.getChild>>(null);
  const [entries, setEntries] = useState<ReturnType<typeof store.getEntries>>([]);
  useEffect(() => {
    setChild(store.getChild());
    setEntries(store.getEntries());
  }, []);

  const actions = [
    { to: "/track", icon: Activity, label: t("home.track"), grad: "gradient-primary", text: "text-primary-foreground" },
    { to: "/insights", icon: Brain, label: t("home.insights"), grad: "gradient-pink", text: "text-pink-foreground" },
    { to: "/emergency", icon: Siren, label: t("home.emergency"), grad: "gradient-alert", text: "text-destructive-foreground" },
    { to: "/advice", icon: Lightbulb, label: t("home.advice"), grad: "bg-[color:var(--lavender)]", text: "text-foreground" },
  ] as const;

  return (
    <MobileShell>
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-5">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{t("home.greeting")}</p>
            <h1 className="text-xl font-extrabold truncate">{child?.name ?? "Baby"} 💙</h1>
          </div>
          <Link to="/profile" className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-card shadow-soft">
            {child?.avatar ? (
              <img src={child.avatar} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <img src={babyMascot} alt="baby" width={48} height={48} className="h-full w-full object-cover bg-gradient-to-br from-pink/40 to-primary/40" />
            )}
          </Link>
        </div>

        <div className="relative mb-5">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            placeholder={t("home.searchPh")}
            className="w-full h-12 rounded-2xl bg-card shadow-soft ps-12 pe-4 text-sm outline-none border border-transparent focus:border-ring transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {actions.map((a, i) => (
            <motion.div
              key={a.to}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={a.to}
                className={`block rounded-3xl p-4 ${a.grad} ${a.text} shadow-card hover:scale-[1.03] transition-all`}
              >
                <div className="h-10 w-10 rounded-2xl bg-white/30 grid place-items-center mb-3">
                  <a.icon size={20} />
                </div>
                <p className="font-semibold text-sm leading-tight">{a.label}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <h2 className="text-sm font-bold mb-2 px-1">{t("home.recent")}</h2>
        <div className="space-y-2">
          {entries.length === 0 && (
            <SoftCard className="text-center py-8 text-sm text-muted-foreground">
              {t("home.noActivity")}
            </SoftCard>
          )}
          {entries.slice(0, 4).map((e) => (
            <SoftCard key={e.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-sm">{e.food}</p>
                <p className="text-xs text-muted-foreground">{e.symptoms.join(", ") || "—"}</p>
              </div>
              <span className="text-xs text-muted-foreground">{format(e.timestamp, "HH:mm")}</span>
            </SoftCard>
          ))}
        </div>
      </div>

      <Link
        to="/track"
        className="fixed bottom-24 end-5 z-30 h-14 w-14 rounded-full gradient-primary text-primary-foreground shadow-glow grid place-items-center hover:scale-110 transition"
        aria-label="Add entry"
      >
        <Plus size={26} />
      </Link>

      <BottomTabBar />
    </MobileShell>
  );
}

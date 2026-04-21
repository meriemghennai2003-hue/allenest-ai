import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Globe, Moon, Volume2, Type, Contrast, Stethoscope, Shield, Info, ChevronRight } from "lucide-react";
import { ScreenHeader, MobileShell } from "@/components/ui-kit/Layout";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { BottomTabBar } from "@/components/ui-kit/BottomTabBar";
import { setLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({ component: Settings });

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 rounded-full transition ${on ? "gradient-primary" : "bg-muted"}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "start-[22px]" : "start-0.5"}`} />
    </button>
  );
}

function Settings() {
  const { t, i18n } = useTranslation();
  const [dark, setDark] = useState(false);
  const [voice, setVoice] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <MobileShell>
      <ScreenHeader title={t("settings.title")} back />
      <div className="px-5 space-y-3">
        <SoftCard className="space-y-3">
          <Row icon={Globe} label={t("settings.language")}>
            <select
              value={i18n.language}
              onChange={(e) => setLanguage(e.target.value as "ar" | "fr" | "en")}
              className="bg-muted rounded-xl px-3 h-9 text-sm outline-none"
            >
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </Row>
          <Row icon={Moon} label={t("settings.dark")}>
            <Toggle on={dark} onChange={setDark} />
          </Row>
          <Row icon={Volume2} label={t("settings.voice")}>
            <Toggle on={voice} onChange={setVoice} />
          </Row>
          <Row icon={Type} label={t("settings.largeText")}>
            <Toggle on={largeText} onChange={setLargeText} />
          </Row>
          <Row icon={Contrast} label={t("settings.contrast")}>
            <Toggle on={contrast} onChange={setContrast} />
          </Row>
        </SoftCard>

        <Link to="/doctor" className="block">
          <SoftCard className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl gradient-sky grid place-items-center"><Stethoscope size={18} /></div>
            <span className="font-semibold text-sm flex-1">{t("doctor.title")}</span>
            <ChevronRight className="text-muted-foreground" size={18} />
          </SoftCard>
        </Link>

        <SoftCard className="space-y-3">
          <Row icon={Info} label={t("settings.about")}><ChevronRight className="text-muted-foreground" size={18} /></Row>
          <Row icon={Shield} label={t("settings.privacy")}><ChevronRight className="text-muted-foreground" size={18} /></Row>
        </SoftCard>

        <p className="text-center text-xs text-muted-foreground pt-2">AlleNest AI · v1.0</p>
      </div>
      <BottomTabBar />
    </MobileShell>
  );
}

function Row({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-muted grid place-items-center text-foreground"><Icon size={16} /></div>
      <span className="flex-1 text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}

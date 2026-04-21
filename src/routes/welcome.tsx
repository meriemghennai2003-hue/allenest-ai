import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { setLanguage } from "@/lib/i18n";
import { PrimaryButton } from "@/components/ui-kit/PrimaryButton";
import { store } from "@/lib/store";
import family from "@/assets/family.png";
import logo from "@/assets/logo.jpg";

export const Route = createFileRoute("/welcome")({ component: Welcome });

function Welcome() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const langs: { code: "ar" | "fr" | "en"; label: string; flag: string }[] = [
    { code: "ar", label: "العربية", flag: "🇩🇿" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
  ];

  const start = () => {
    store.setOnboarded(true);
    navigate({ to: "/profile" });
  };

  return (
    <div className="mx-auto max-w-md min-h-screen px-6 pt-10 pb-8 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <img src={logo} alt="AlleNest logo" width={48} height={48} className="h-12 w-12 rounded-2xl object-cover shadow-soft" />
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">{t("app.name")}</h1>
          <p className="text-xs text-muted-foreground">{t("app.tagline")}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="relative mt-6 mb-4 grid place-items-center"
      >
        <div className="absolute inset-x-6 inset-y-2 rounded-[3rem] gradient-sky opacity-70 blur-xl" />
        <img src={family} alt="Happy family illustration" width={420} height={420} className="relative w-72 h-72 object-contain drop-shadow-xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-2 mb-6"
      >
        <h2 className="text-2xl font-extrabold leading-tight">
          {t("onboarding.title")} <br />
          <span className="bg-clip-text text-transparent bg-[image:var(--gradient-primary)]">{t("onboarding.title2")}</span>
        </h2>
        <p className="text-sm text-muted-foreground px-4">{t("onboarding.desc")}</p>
      </motion.div>

      <div className="space-y-3 mb-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground text-center font-semibold">
          {t("lang.choose")}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {langs.map((l) => {
            const active = i18n.language === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`rounded-2xl py-3 px-2 text-sm font-semibold transition-all border ${
                  active
                    ? "gradient-primary text-primary-foreground border-transparent shadow-glow"
                    : "bg-card border-border text-foreground hover:bg-muted"
                }`}
              >
                <div className="text-lg">{l.flag}</div>
                <div className="text-xs mt-0.5">{l.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <PrimaryButton size="lg" fullWidth onClick={start}>
        {t("common.start")}
      </PrimaryButton>
    </div>
  );
}

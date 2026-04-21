import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  title?: string;
  back?: boolean;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, back, right }: Props) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const isRTL = i18n.language === "ar";
  const Arrow = isRTL ? ArrowRight : ArrowLeft;
  return (
    <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
      <div className="flex items-center gap-3 min-w-0">
        {back && (
          <button
            onClick={() => router.history.back()}
            aria-label="Back"
            className="h-10 w-10 rounded-full bg-card shadow-soft grid place-items-center hover:scale-105 transition"
          >
            <Arrow size={18} />
          </button>
        )}
        {title && <h1 className="text-xl font-bold tracking-tight truncate">{title}</h1>}
      </div>
      {right}
    </header>
  );
}

export function MobileShell({ children, withTabs = true }: { children: React.ReactNode; withTabs?: boolean }) {
  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-md min-h-screen relative pb-28">{children}</div>
    </div>
  );
}

export { Link };

import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Props {
  value: number;
  onChange: (v: number) => void;
  className?: string;
}

export function SeveritySlider({ value, onChange, className }: Props) {
  const { t } = useTranslation();
  const color = value > 66 ? "var(--destructive)" : value > 33 ? "var(--warning)" : "var(--success)";
  return (
    <div className={cn("space-y-3", className)}>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full appearance-none h-2 rounded-full cursor-pointer"
        style={{
          background: `linear-gradient(90deg, ${color} ${value}%, var(--muted) ${value}%)`,
        }}
      />
      <div className="flex justify-between text-xs font-medium text-muted-foreground">
        <span>{t("track.low")}</span>
        <span>{t("track.med")}</span>
        <span>{t("track.high")}</span>
      </div>
    </div>
  );
}

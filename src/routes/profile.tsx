import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Camera } from "lucide-react";
import { ScreenHeader } from "@/components/ui-kit/Layout";
import { SoftCard } from "@/components/ui-kit/SoftCard";
import { PrimaryButton } from "@/components/ui-kit/PrimaryButton";
import { store, Child } from "@/lib/store";
import babyMascot from "@/assets/baby-mascot.png";

export const Route = createFileRoute("/profile")({ component: ProfileSetup });

const ALLERGENS = ["🥚 Eggs", "🥛 Milk", "🥜 Peanut", "🌾 Gluten", "🐟 Fish", "🍤 Shrimp", "🍓 Strawberry", "🍯 Honey"];

function ProfileSetup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const existing = typeof window !== "undefined" ? store.getChild() : null;
  const [name, setName] = useState(existing?.name ?? "");
  const [birthdate, setBirthdate] = useState(existing?.birthdate ?? "");
  const [gender, setGender] = useState<"male" | "female">(existing?.gender ?? "male");
  const [feeding, setFeeding] = useState<Child["feeding"]>(existing?.feeding ?? "breast");
  const [allergies, setAllergies] = useState<string[]>(existing?.allergies ?? []);
  const [avatar, setAvatar] = useState<string | undefined>(existing?.avatar);

  const toggle = (a: string) =>
    setAllergies((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(f);
  };

  const save = () => {
    const child: Child = {
      id: existing?.id ?? crypto.randomUUID(),
      name: name || "Baby",
      birthdate, gender, feeding, allergies, avatar,
    };
    store.setChild(child);
    navigate({ to: "/home" });
  };

  return (
    <div className="mx-auto max-w-md px-5 pb-10">
      <ScreenHeader title={t("profile.title")} back />

      <div className="flex justify-center my-4">
        <label className="relative cursor-pointer group">
          <div className="h-28 w-28 rounded-full bg-gradient-to-br from-pink/40 to-primary/40 grid place-items-center overflow-hidden shadow-glow ring-4 ring-card">
            {avatar ? (
              <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <img src={babyMascot} alt="baby" width={96} height={96} className="h-24 w-24 object-contain" />
            )}
          </div>
          <span className="absolute bottom-0 end-0 h-9 w-9 rounded-full gradient-primary text-primary-foreground grid place-items-center shadow-soft group-hover:scale-110 transition">
            <Camera size={16} />
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
        </label>
      </div>

      <SoftCard className="space-y-4">
        <Field label={t("profile.name")}>
          <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Adam" />
        </Field>
        <Field label={t("profile.birthdate")}>
          <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="field" />
        </Field>
        <Field label={t("profile.gender")}>
          <div className="flex gap-2">
            {(["male", "female"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 h-11 rounded-2xl font-semibold text-sm transition ${
                  gender === g ? "gradient-primary text-primary-foreground shadow-soft" : "bg-muted text-foreground"
                }`}
              >
                {t(`profile.${g}`)}
              </button>
            ))}
          </div>
        </Field>
        <Field label={t("profile.feeding")}>
          <select value={feeding} onChange={(e) => setFeeding(e.target.value as Child["feeding"])} className="field">
            <option value="breast">{t("profile.breast")}</option>
            <option value="formula">{t("profile.formula")}</option>
            <option value="mixed">{t("profile.mixed")}</option>
            <option value="solid">{t("profile.solid")}</option>
          </select>
        </Field>
        <Field label={t("profile.allergies")}>
          <div className="flex flex-wrap gap-2">
            {ALLERGENS.map((a) => {
              const on = allergies.includes(a);
              return (
                <button
                  key={a}
                  onClick={() => toggle(a)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                    on ? "gradient-pink text-pink-foreground border-transparent shadow-pink" : "bg-card border-border"
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </Field>
      </SoftCard>

      <PrimaryButton fullWidth size="lg" className="mt-5" onClick={save}>
        {t("profile.saveProfile")}
      </PrimaryButton>

      <style>{`.field{width:100%;height:44px;border-radius:14px;background:var(--muted);padding:0 14px;font-size:14px;outline:none;border:1px solid transparent;transition:all .2s}.field:focus{border-color:var(--ring);background:var(--card)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

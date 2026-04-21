import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "soft";
type Size = "sm" | "md" | "lg";

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "gradient-primary text-primary-foreground shadow-glow hover:scale-[1.02] active:scale-[0.98]",
  secondary: "gradient-pink text-pink-foreground shadow-pink hover:scale-[1.02] active:scale-[0.98]",
  ghost: "bg-card/60 text-foreground hover:bg-card border border-border",
  danger: "gradient-alert text-destructive-foreground shadow-card hover:scale-[1.02] active:scale-[0.98]",
  soft: "bg-secondary/60 text-secondary-foreground hover:bg-secondary",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  ),
);
PrimaryButton.displayName = "PrimaryButton";

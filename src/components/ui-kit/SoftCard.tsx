import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function SoftCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-card shadow-card p-5 border border-border/50 transition-all",
        className,
      )}
      {...props}
    />
  );
}

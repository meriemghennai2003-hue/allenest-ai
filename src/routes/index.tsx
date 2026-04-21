import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { store } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onboarded = store.isOnboarded();
    const hasChild = !!store.getChild();
    if (!onboarded) navigate({ to: "/welcome" });
    else if (!hasChild) navigate({ to: "/profile" });
    else navigate({ to: "/home" });
  }, [navigate]);
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="h-12 w-12 rounded-full gradient-primary animate-pulse shadow-glow" />
    </div>
  );
}

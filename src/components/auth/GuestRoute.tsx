"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { FullPageSpinner } from "@/components/ui/Spinner";

export function GuestRoute({ children }: { children: ReactNode }) {
  const { firebaseUser, profile, guest, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      router.replace("/login");
    } else if (profile && profile.role !== "guest") {
      router.replace("/admin");
    }
  }, [loading, firebaseUser, profile, router]);

  if (loading || !firebaseUser || !guest) return <FullPageSpinner />;

  return <>{children}</>;
}

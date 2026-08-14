"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { FullPageSpinner } from "@/components/ui/Spinner";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { firebaseUser, isAdmin, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      router.replace("/login?admin=1");
    } else if (profile && !isAdmin) {
      router.replace("/");
    }
  }, [loading, firebaseUser, profile, isAdmin, router]);

  if (loading || !firebaseUser || !isAdmin) return <FullPageSpinner />;

  return <>{children}</>;
}

"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HomeView } from "@/modules/client/home/components/HomeView";

function LoginContent() {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get("redirect");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (redirectParam) {
        router.replace(redirectParam);
      } else if (hasRole("ADMIN", "MANAGER")) {
        router.replace("/admin");
      }
    }
  }, [isAuthenticated, isLoading, hasRole, redirectParam, router]);

  return <HomeView initialAuthMode="login" initialOpen={true} />;
}

export default function DangNhapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <LoginContent />
    </Suspense>
  );
}

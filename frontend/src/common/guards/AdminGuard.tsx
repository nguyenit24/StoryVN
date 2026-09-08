"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login?redirect=/admin");
      } else if (!hasRole("ADMIN", "MANAGER", "staff", "admin", "manager")) {
        router.replace("/");
      }
    }
  }, [isAuthenticated, isLoading, hasRole, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent shadow-lg" />
          <span className="text-xs font-semibold text-slate-400">Đang xác thực quyền truy cập Admin...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !hasRole("ADMIN", "MANAGER", "staff", "admin", "manager")) {
    return null;
  }

  return <>{children}</>;
}

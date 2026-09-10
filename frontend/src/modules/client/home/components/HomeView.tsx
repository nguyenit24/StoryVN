"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AuthDrawer, AuthMode } from "@/modules/client/auth/components/AuthDrawer";
import { LogoutConfirmModal } from "@/modules/client/profile/components/LogoutConfirmModal";
import { ClientHeader } from "@/components/layout/ClientHeader";
import { FeaturedHero } from "./FeaturedHero";
import { CategoryFiltersBar } from "./CategoryFiltersBar";
import { HotNovelsGrid } from "./HotNovelsGrid";
import { NewReleasesSection } from "./NewReleasesSection";
import { LiveChaptersFeed } from "./LiveChaptersFeed";
import { AuthorStudioPromo } from "./AuthorStudioPromo";
import { RankingsSidebar } from "./RankingsSidebar";
import { VipPromoCard } from "./VipPromoCard";
import { FeaturedAuthorsSidebar } from "./FeaturedAuthorsSidebar";
import { ActiveForumTopics } from "./ActiveForumTopics";
import { ClientFooter } from "@/components/layout/ClientFooter";

interface HomeViewProps {
  initialAuthMode?: AuthMode;
  initialOpen?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  initialAuthMode = "login",
  initialOpen = false,
}) => {
  const router = useRouter();
  const { user, logout: contextLogout } = useAuth();

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(initialOpen);
  const [authMode, setAuthMode] = useState<AuthMode>(initialAuthMode);

  // Logout Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả thể loại");
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string | null>(null);

  const authModePathMap: Record<AuthMode, string> = {
    login: "/dang-nhap",
    register: "/dang-ky",
    "forgot-password": "/quen-mat-khau",
  };

  // Handle browser back/forward buttons for /dang-nhap, /dang-ky, /quen-mat-khau
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/dang-nhap" || path === "/login") {
        setAuthMode("login");
        setIsAuthOpen(true);
      } else if (path === "/dang-ky" || path === "/register") {
        setAuthMode("register");
        setIsAuthOpen(true);
      } else if (path === "/quen-mat-khau" || path === "/forgot-password") {
        setAuthMode("forgot-password");
        setIsAuthOpen(true);
      } else {
        setIsAuthOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", authModePathMap[mode]);
    }
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/");
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 flex flex-col min-h-screen selection:bg-blue-600 selection:text-white">
      {/* 1. Main Header */}
      <ClientHeader
        user={user}
        onOpenAuth={openAuth}
        onLogout={() => setIsLogoutModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Hero Featured Novel */}
        <FeaturedHero />

        {/* Category Filters Bar */}
        <CategoryFiltersBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedQuickFilter={selectedQuickFilter}
          onSelectQuickFilter={setSelectedQuickFilter}
        />

        {/* Two-Column Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Main Showcase Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Section 1: Hot Books of The Day */}
            <HotNovelsGrid />

            {/* Section 2: Newly Released Novels */}
            <NewReleasesSection />

            {/* Section 3: Live Chapter Releases */}
            <LiveChaptersFeed />

            {/* Section 4: Author Studio Promotion Banner */}
            <AuthorStudioPromo />
          </div>

          {/* RIGHT COLUMN: Sidebar (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Sidebar 1: Leaderboards */}
            <RankingsSidebar />

            {/* Sidebar 2: VIP Premium Promo Card */}
            <VipPromoCard />

            {/* Sidebar 3: Featured Authors */}
            <FeaturedAuthorsSidebar />

            {/* Sidebar 4: Active Forum Topics */}
            <ActiveForumTopics />
          </aside>
        </div>
      </main>

      {/* 3. Main Footer */}
      <ClientFooter />

      {/* 4. Auth Modals */}
      <AuthDrawer
        isOpen={isAuthOpen}
        mode={authMode}
        onClose={closeAuth}
        onSwitchMode={(mode) => {
          setAuthMode(mode);
          if (typeof window !== "undefined") {
            window.history.replaceState(null, "", authModePathMap[mode]);
          }
        }}
        onSuccess={() => {
          setIsAuthOpen(false);
          router.refresh();
        }}
      />

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        defaultMode="current"
        onClose={() => setIsLogoutModalOpen(false)}
        onSuccess={() => {
          contextLogout();
          setIsLogoutModalOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
};

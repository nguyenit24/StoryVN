"use client";

import React, { useState, useEffect } from "react";
import ManagerSidebar from "./ManagerSidebar";
import ManagerHeader from "./ManagerHeader";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("manager_sidebar_collapsed");
      if (saved === "true") {
        setIsCollapsed(true);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("manager_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex">
      {/* Fixed Left Sidebar */}
      <ManagerSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <ManagerHeader
          onToggleMobileSidebar={() => setIsMobileOpen((prev) => !prev)}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {children}
      </div>
    </div>
  );
}

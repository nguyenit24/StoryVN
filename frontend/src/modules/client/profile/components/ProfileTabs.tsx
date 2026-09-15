"use client";

import React from "react";

type TabKey = "works" | "library" | "history" | "forum" | "badges";

interface ProfileTabsProps {
  activeTab: TabKey;
  isAuthor: boolean;
  onTabChange: (tab: TabKey) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, isAuthor, onTabChange }) => {
  const tabClass = (key: TabKey) =>
    `px-4 py-3 rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
      activeTab === key
        ? "text-blue-600 border-b-2 border-blue-600 font-black bg-blue-50/50"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  return (
    <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs sm:text-sm font-bold">
      {isAuthor && (
        <button type="button" onClick={() => onTabChange("works")} className={tabClass("works")}>
          <span>📚 Tác phẩm đã phát hành</span>
          <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[10px] rounded-full">4</span>
        </button>
      )}

      <button type="button" onClick={() => onTabChange("library")} className={tabClass("library")}>
        <span>📖 Tủ sách cá nhân</span>
        <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] rounded-full">32</span>
      </button>

      <button type="button" onClick={() => onTabChange("history")} className={tabClass("history")}>
        <span>🕒 Lịch sử đọc truyện</span>
        <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] rounded-full">12</span>
      </button>

      <button type="button" onClick={() => onTabChange("forum")} className={tabClass("forum")}>
        <span>💬 Bài viết diễn đàn</span>
        <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] rounded-full">18</span>
      </button>

      <button type="button" onClick={() => onTabChange("badges")} className={tabClass("badges")}>
        <span>🏅 Huy hiệu vinh danh</span>
        <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] rounded-full">12</span>
      </button>
    </div>
  );
};

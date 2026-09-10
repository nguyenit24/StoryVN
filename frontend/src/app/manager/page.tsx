import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Tổng quan nội dung - StoryVN Manager Portal",
};

export default function ManagerDashboardPage() {
  const navCards = [
    {
      title: "Quản lý Tác phẩm",
      href: "/manager/stories",
      icon: "auto_stories",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      hoverBorder: "hover:border-blue-300",
    },
    {
      title: "Quản lý Thể loại",
      href: "/manager/categories",
      icon: "category",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      hoverBorder: "hover:border-indigo-300",
    },
    {
      title: "Quản lý Thẻ Tag",
      href: "/manager/tags",
      icon: "label",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      hoverBorder: "hover:border-purple-300",
    },
  ];

  return (
    <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 animate-fadeIn">
      {/* 1. Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            Manager Portal
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] font-medium text-slate-500">
            Tổng quan nghiệp vụ
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Quản lý Nội dung
        </h1>
      </div>

      {/* 2. Quick Navigation Utility Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {navCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`group bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md ${card.hoverBorder} active:scale-98 transition-all flex items-center justify-between gap-4`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={`w-12 h-12 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
              >
                <span className="material-symbols-outlined text-[26px]">
                  {card.icon}
                </span>
              </div>
              <span className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                {card.title}
              </span>
            </div>

            <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-600 flex items-center justify-center shrink-0 transition-colors">
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

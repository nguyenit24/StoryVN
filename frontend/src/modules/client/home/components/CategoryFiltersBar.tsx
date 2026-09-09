"use client";

import React from "react";

const CATEGORIES = [
  "Tất cả thể loại",
  "Tiên Hiệp",
  "Huyền Huyễn",
  "Ngôn Tình",
  "Trọng Sinh",
  "Đô Thị",
  "Võng Du",
  "Khoa Huyễn",
  "Đồng Nhân",
];

const QUICK_FILTERS = [
  { id: "completed", label: "• Mới hoàn thành" },
  { id: "vip", label: "• VIP" },
  { id: "free", label: "• Miễn phí" },
];

interface CategoryFiltersBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedQuickFilter: string | null;
  onSelectQuickFilter: (filter: string | null) => void;
}

export const CategoryFiltersBar: React.FC<CategoryFiltersBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedQuickFilter,
  onSelectQuickFilter,
}) => {
  return (
    <div
      id="the-loai"
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80"
    >
      {/* Category Chips */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Quick Sub-filters */}
      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium self-end md:self-auto shrink-0 whitespace-nowrap">
        <span className="text-slate-400">Lọc nhanh:</span>
        {QUICK_FILTERS.map((qf) => {
          const isActive = selectedQuickFilter === qf.id;
          return (
            <button
              key={qf.id}
              onClick={() => onSelectQuickFilter(isActive ? null : qf.id)}
              className={`flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isActive ? "text-blue-600 font-bold" : "hover:text-blue-600"
              }`}
            >
              {qf.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

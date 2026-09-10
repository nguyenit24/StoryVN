"use client";

import React from "react";
import { StoryStatusType } from "../models/story.model";

interface StoryFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: StoryStatusType | "ALL";
  onStatusFilterChange: (val: StoryStatusType | "ALL") => void;
  vipFilter: boolean | "ALL";
  onVipFilterChange: (val: boolean | "ALL") => void;
  totalResults: number;
}

export default function StoryFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  vipFilter,
  onVipFilterChange,
  totalResults,
}: StoryFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo tên tác phẩm..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Filters Group */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Trạng thái:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as StoryStatusType | "ALL")}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="DRAFT">Bản nháp (DRAFT)</option>
            <option value="ONGOING">Đang ra (ONGOING)</option>
            <option value="COMPLETED">Hoàn thành (COMPLETED)</option>
            <option value="PAUSED">Tạm dừng (PAUSED)</option>
          </select>
        </div>

        {/* VIP Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Phân loại:
          </label>
          <select
            value={vipFilter === "ALL" ? "ALL" : vipFilter ? "VIP" : "FREE"}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "ALL") onVipFilterChange("ALL");
              else if (val === "VIP") onVipFilterChange(true);
              else onVipFilterChange(false);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="ALL">Tất cả truyện</option>
            <option value="VIP">Truyện VIP</option>
            <option value="FREE">Truyện Thường</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium ml-auto lg:ml-2">
          Tổng: <strong>{totalResults}</strong> tác phẩm
        </span>
      </div>
    </div>
  );
}

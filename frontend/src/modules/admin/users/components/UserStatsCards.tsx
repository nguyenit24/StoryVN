"use client";

import React from "react";

interface UserStatsCardsProps {
  totalCount: number;
  readersCount: number;
  authorsCount: number;
  lockedCount: number;
}

export default function UserStatsCards({
  totalCount,
  readersCount,
  authorsCount,
  lockedCount,
}: UserStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Tổng tài khoản */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">Tổng tài khoản</span>
          <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[19px]">group</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900">
            {totalCount.toLocaleString("vi-VN")}
          </span>
          <span className="text-xs font-semibold text-blue-600">
            Toàn hệ thống
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tài khoản người dùng</span>
          <span className="text-slate-600 font-medium">100%</span>
        </div>
      </div>

      {/* Card 2: Độc Giả */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">Độc Giả (USER)</span>
          <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[19px]">local_library</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900">
            {readersCount.toLocaleString("vi-VN")}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
            {totalCount > 0 ? ((readersCount / totalCount) * 100).toFixed(1) : 0}%
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Bạn đọc trực tuyến</span>
          <span className="text-indigo-600 font-medium">Đang theo dõi</span>
        </div>
      </div>

      {/* Card 3: Tác Giả */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">Tác Giả (AUTHOR)</span>
          <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[19px]">edit_note</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900">
            {authorsCount.toLocaleString("vi-VN")}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
            Có bút danh
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tác giả sáng tác &amp; dịch</span>
          <span className="text-emerald-700 font-medium">{authorsCount} nhà văn</span>
        </div>
      </div>

      {/* Card 4: Tài khoản tạm khóa */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500">Tài khoản tạm khóa</span>
          <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[19px]">lock</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-rose-600">{lockedCount}</span>
          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-semibold">
            {lockedCount > 0 ? "Cần kiểm tra" : "An toàn"}
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Trạng thái tài khoản</span>
          <span className="text-rose-600 font-medium">Bị vô hiệu hóa</span>
        </div>
      </div>
    </div>
  );
}

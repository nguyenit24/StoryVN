"use client";

import React from "react";
import { DashboardKpis } from "../models/dashboard.model";

interface KpiMetricsDeckProps {
  kpis?: DashboardKpis;
}

export default function KpiMetricsDeck({ kpis }: KpiMetricsDeckProps) {
  if (!kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white rounded-xl border border-slate-200/90 shadow-xs animate-pulse" />
        ))}
      </div>
    );
  }

  const { revenue, activeWorks, totalUsers, urgentTasks } = kpis;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Doanh thu Xu */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {revenue.title}
          </span>
          <div className={`w-8 h-8 rounded-lg ${revenue.iconBgColor} ${revenue.iconTextColor} flex items-center justify-center`}>
            <span className="material-symbols-outlined text-[18px]">{revenue.icon}</span>
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{revenue.value}</span>
          <span className="text-sm font-semibold text-blue-600">{revenue.unit}</span>
        </div>
        <div className="mt-2.5 flex items-center text-xs text-emerald-600 font-medium">
          <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>
          <span>{revenue.changeText}</span>
          <span className="text-slate-400 ml-1 font-normal">{revenue.subText}</span>
        </div>
      </div>

      {/* Card 2: Tác phẩm đang xuất bản */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {activeWorks.title}
          </span>
          <div className={`w-8 h-8 rounded-lg ${activeWorks.iconBgColor} ${activeWorks.iconTextColor} flex items-center justify-center`}>
            <span className="material-symbols-outlined text-[18px]">{activeWorks.icon}</span>
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{activeWorks.value}</span>
          <span className="text-xs text-slate-400 font-normal">{activeWorks.unit}</span>
        </div>
        <div className="mt-2.5 flex items-center text-xs text-indigo-600 font-medium">
          <span className="material-symbols-outlined text-[16px] mr-1">add_circle</span>
          <span>{activeWorks.changeText}</span>
          <span className="text-slate-400 ml-1 font-normal">{activeWorks.subText}</span>
        </div>
      </div>

      {/* Card 3: Tổng người dùng */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {totalUsers.title}
          </span>
          <div className={`w-8 h-8 rounded-lg ${totalUsers.iconBgColor} ${totalUsers.iconTextColor} flex items-center justify-center`}>
            <span className="material-symbols-outlined text-[18px]">{totalUsers.icon}</span>
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{totalUsers.value}</span>
          <span className="text-xs text-slate-400 font-normal">{totalUsers.unit}</span>
        </div>
        <div className="mt-2.5 flex items-center text-xs text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
          <span className="font-semibold text-slate-800">{totalUsers.changeText}</span>
          <span className="text-slate-400 ml-1">{totalUsers.subText}</span>
        </div>
      </div>

      {/* Card 4: Yêu cầu cần xử lý */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            {urgentTasks.title}
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">pending_actions</span>
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-amber-600 tracking-tight">{urgentTasks.total}</span>
          <span className="text-xs text-amber-700 font-medium">{urgentTasks.unit}</span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          {/* 14 duyệt chương */}
          <div className="relative group/tip">
            <span
              title={`${urgentTasks.chaptersPending} duyệt chương`}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 font-bold text-xs cursor-pointer hover:bg-rose-100 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>{urgentTasks.chaptersPending}</span>
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover/tip:opacity-100 transition-opacity duration-150 z-20">
              {urgentTasks.chaptersPending} duyệt chương
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>

          <span className="text-slate-300 text-xs font-bold">•</span>

          {/* 8 diễn đàn */}
          <div className="relative group/tip">
            <span
              title={`${urgentTasks.forumPending} diễn đàn`}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 font-bold text-xs cursor-pointer hover:bg-amber-100 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{urgentTasks.forumPending}</span>
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover/tip:opacity-100 transition-opacity duration-150 z-20">
              {urgentTasks.forumPending} diễn đàn
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>

          <span className="text-slate-300 text-xs font-bold">•</span>

          {/* 6 rút xu */}
          <div className="relative group/tip">
            <span
              title={`${urgentTasks.withdrawPending} rút xu`}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 font-bold text-xs cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>{urgentTasks.withdrawPending}</span>
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-md shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover/tip:opacity-100 transition-opacity duration-150 z-20">
              {urgentTasks.withdrawPending} rút xu
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

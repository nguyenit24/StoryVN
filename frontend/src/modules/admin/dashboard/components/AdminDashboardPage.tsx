"use client";

import React from "react";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { DashboardTimeFilter } from "../models/dashboard.model";
import KpiMetricsDeck from "./KpiMetricsDeck";
import RevenueChartSection from "./RevenueChartSection";
import RecentTransactionsTable from "./RecentTransactionsTable";
import UserDemographicsWidget from "./UserDemographicsWidget";

const TIME_FILTERS: { label: string; value: DashboardTimeFilter }[] = [
  { label: "Hôm nay", value: "today" },
  { label: "7 ngày", value: "7days" },
  { label: "Tháng này", value: "month" },
  { label: "Năm nay", value: "year" },
];

export default function AdminDashboardPage() {
  const { data, timeFilter, setTimeFilter, handleExport } = useAdminDashboard();

  return (
    <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 animate-fadeIn">
      {/* Page Header & Time Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Số liệu thống kê và báo cáo vận hành thời gian thực
          </p>
        </div>

        {/* Time Range Controls and Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="inline-flex bg-white p-1 rounded-lg border border-slate-200 shadow-xs text-sm">
            {TIME_FILTERS.map((f) => {
              const active = timeFilter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setTimeFilter(f.value)}
                  className={`px-3 py-1.5 rounded-md font-medium text-xs transition-all ${
                    active
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metrics Deck */}
      <KpiMetricsDeck kpis={data?.kpis} />

      {/* Row 1: Revenue Chart (8 cols) & User Demographics (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <RevenueChartSection
            points={data?.chartPoints}
            peakTooltip={data?.peakTooltip}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <UserDemographicsWidget
            items={data?.demographics?.items}
            totalFormatted={data?.demographics?.totalFormatted}
          />
        </div>
      </div>

      {/* Row 2: Recent Transactions Table (Full Width 12 cols) */}
      <RecentTransactionsTable
        transactions={data?.recentTransactions}
      />
    </main>
  );
}

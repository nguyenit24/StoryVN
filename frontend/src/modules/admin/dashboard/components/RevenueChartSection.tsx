"use client";

import React from "react";
import { ChartCurvePoint } from "../models/dashboard.model";

interface RevenueChartSectionProps {
  points?: ChartCurvePoint[];
  peakTooltip?: string;
}

export default function RevenueChartSection({ points, peakTooltip }: RevenueChartSectionProps) {
  const chartPoints = points || [
    { dayLabel: "Thứ 6 (18/10)", revenueK: 30, readsK: 120 },
    { dayLabel: "Thứ 7 (19/10)", revenueK: 45, readsK: 160 },
    { dayLabel: "Chủ nhật (20/10)", revenueK: 40, readsK: 185 },
    { dayLabel: "Thứ 2 (21/10)", revenueK: 52, readsK: 210 },
    { dayLabel: "Thứ 3 (22/10)", revenueK: 58, readsK: 245 },
    { dayLabel: "Thứ 4 (23/10)", revenueK: 61, readsK: 280 },
    { dayLabel: "Hôm nay (24/10)", revenueK: 68.4, readsK: 312 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900">Tăng trưởng Doanh thu &amp; Lượt đọc</h2>
          <p className="text-xs text-slate-500 mt-0.5">Thống kê dữ liệu chu kỳ 7 ngày qua</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-blue-600"></span>
            <span>Doanh thu Xu (nghìn Xu)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 border-t-2 border-emerald-500 border-dashed"></span>
            <span>Lượt đọc truyện</span>
          </div>
        </div>
      </div>

      {/* SVG Visual Line Chart */}
      <div className="w-full pt-6">
        <div className="relative h-60 w-full select-none">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-60">
            <div className="w-full border-b border-dashed border-slate-200"></div>
            <div className="w-full border-b border-dashed border-slate-200"></div>
            <div className="w-full border-b border-dashed border-slate-200"></div>
            <div className="w-full border-b border-dashed border-slate-200"></div>
          </div>

          {/* Chart Curves */}
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 720 200">
            <defs>
              <linearGradient id="chartBlueGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15"></stop>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"></stop>
              </linearGradient>
            </defs>

            {/* Revenue Area Fill */}
            <path
              d="M 20,160 C 130,145 180,165 250,110 C 330,60 390,90 470,55 C 550,30 620,60 700,25 L 700,200 L 20,200 Z"
              fill="url(#chartBlueGradient)"
            ></path>

            {/* Revenue Main Curve */}
            <path
              d="M 20,160 C 130,145 180,165 250,110 C 330,60 390,90 470,55 C 550,30 620,60 700,25"
              fill="none"
              stroke="#2563eb"
              strokeLinecap="round"
              strokeWidth="2.5"
            ></path>

            {/* Reads Dashed Line */}
            <path
              d="M 20,180 C 130,165 190,145 250,135 C 330,125 400,105 470,85 C 550,75 620,55 700,45"
              fill="none"
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth="2"
            ></path>

            {/* Data Nodes */}
            <circle cx="250" cy="110" fill="#ffffff" r="4" stroke="#2563eb" strokeWidth="2"></circle>
            <circle cx="470" cy="55" fill="#ffffff" r="4" stroke="#2563eb" strokeWidth="2"></circle>
            <circle cx="700" cy="25" fill="#2563eb" r="5" stroke="#ffffff" strokeWidth="2"></circle>
            <circle cx="700" cy="45" fill="#10b981" r="4"></circle>
          </svg>

          {/* Highlight badge on latest day */}
          <div className="absolute right-2 top-0 bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-md font-medium shadow-xs">
            {peakTooltip || "Hôm nay: 68.400k Xu / 312k reads"}
          </div>
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between text-xs text-slate-500 font-medium pt-3 mt-1 border-t border-slate-100">
          {chartPoints.map((pt, idx) => (
            <span
              key={idx}
              className={idx === chartPoints.length - 1 ? "text-blue-600 font-bold" : ""}
            >
              {pt.dayLabel}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

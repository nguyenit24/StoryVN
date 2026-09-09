"use client";

import React from "react";
import { DemographicItem } from "../models/dashboard.model";

interface UserDemographicsWidgetProps {
  totalFormatted?: string;
  items?: DemographicItem[];
}

export default function UserDemographicsWidget({
  totalFormatted = "Tổng 382.9k",
  items,
}: UserDemographicsWidgetProps) {
  const breakdown = items || [
    {
      label: "Độc giả thường",
      countText: "334.850 (87.4%)",
      percentage: 87.4,
      colorClass: "bg-blue-600",
      bulletClass: "bg-blue-600",
    },
    {
      label: "Độc giả VIP / Hội viên",
      countText: "46.200 (12.1%)",
      percentage: 12.1,
      colorClass: "bg-amber-500",
      bulletClass: "bg-amber-500",
    },
    {
      label: "Tác giả đã xác minh",
      countText: "1.850 (0.5%)",
      percentage: 0.5,
      colorClass: "bg-emerald-500",
      bulletClass: "bg-emerald-500",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600 text-[20px]">pie_chart</span>
          <h3 className="font-bold text-slate-900 text-sm">Cơ cấu người dùng</h3>
        </div>
        <span className="text-xs font-semibold text-slate-500">{totalFormatted}</span>
      </div>

      {/* Breakdown list */}
      <div className="space-y-3 mt-4">
        {breakdown.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.bulletClass}`}></span>
              <span className="text-xs font-medium text-slate-700">{item.label}</span>
            </div>
            <div className="text-xs font-semibold text-slate-900 font-mono">{item.countText}</div>
          </div>
        ))}

        {/* Combined Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex mt-2">
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              className={`h-full ${item.colorClass}`}
              style={{ width: `${item.percentage}%` }}
              title={`${item.label}: ${item.percentage}%`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

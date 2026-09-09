"use client";

import React from "react";
import { SystemHealthData } from "../models/dashboard.model";

interface SystemHealthWidgetProps {
  health?: SystemHealthData;
}

export default function SystemHealthWidget({ health }: SystemHealthWidgetProps) {
  const currentHealth = health || {
    blockedBots24h: 1420,
    cpuUsage: 24.2,
    redisUsage: 42.8,
    isDrmActive: true,
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600 text-[20px]">shield</span>
          <h3 className="font-bold text-slate-900 text-sm">Tình trạng hệ thống</h3>
        </div>
        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Bình thường
        </span>
      </div>

      <div className="space-y-4 mt-4 text-xs">
        {/* IP bot protection */}
        <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-100">
          <div>
            <div className="text-slate-500 text-[11px]">Tường lửa chống thu thập (Bot Crawler)</div>
            <div className="text-slate-900 font-semibold text-sm mt-0.5">
              {currentHealth.blockedBots24h.toLocaleString("vi-VN")}{" "}
              <span className="text-xs font-normal text-slate-400">yêu cầu đã chặn</span>
            </div>
          </div>
          <div className="w-7 h-7 rounded-md bg-slate-200/60 text-slate-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">block</span>
          </div>
        </div>

        {/* Memory and Cluster Usage */}
        <div className="space-y-2">
          <div className="flex justify-between font-medium">
            <span className="text-slate-500">Tải xử lý CPU Cluster</span>
            <span className="text-slate-800 font-semibold font-mono">{currentHealth.cpuUsage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${currentHealth.cpuUsage}%` }}
            ></div>
          </div>

          <div className="flex justify-between font-medium pt-1">
            <span className="text-slate-500">Dung lượng bộ nhớ Redis Cache</span>
            <span className="text-slate-800 font-semibold font-mono">{currentHealth.redisUsage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${currentHealth.redisUsage}%` }}
            ></div>
          </div>
        </div>

        {/* Copyright Protection status note */}
        <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg flex items-start gap-2 text-slate-700">
          <span className="material-symbols-outlined text-blue-600 text-[18px] shrink-0">
            verified_user
          </span>
          <span className="text-[11px] leading-relaxed">
            Hệ thống mã hóa bảo vệ bản quyền văn bản (DRM) hoạt động bình thường trên tất cả các chương truyện.
          </span>
        </div>
      </div>
    </div>
  );
}

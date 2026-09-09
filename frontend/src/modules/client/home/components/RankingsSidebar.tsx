"use client";

import React, { useState } from "react";
import Link from "next/link";

const TOP_THREE = [
  {
    rank: 1,
    rankColor: "text-amber-500",
    title: "Vạn Cổ Đệ Nhất Thần Long",
    author: "Phong Thanh Dương",
    views: "542K lượt đọc",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcOcpXtirPbSycNdnnIRFE8wse-osixt_mVJJpvtWTDkHKqs1LqSHQXjKy1aU4AmOvj_WHvy1AwukA_nZBINJjZ_R0ExTn5vG0peg5_LuimkPRcM-mlKsh0Wc2iDmfliM7YP3W4PYc4EWCNxFQVm4L4EdQtaGQ4JOERe-wxc6iiPfbIQ5G2iD6kp5VqpEL-oL2w0G9a6i17qVgdNxt8QA8gSPaSmQoW3cg9go8nJzqKMhQS9UjY5j4nA",
  },
  {
    rank: 2,
    rankColor: "text-slate-400",
    title: "Kiếm Đạo Đệ Nhất Tiên",
    author: "Tiêu Dao",
    views: "412K lượt đọc",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0gNLBv8iHWpD1-mv6mr5vXR1hBHtRmQIO9LnmdiTXSe1kmqVh3AB9e1fNnYsPaJcQFrYImu1hsYMeMXpMnDdv1Pu6BUcNgY0EClruiarKWeCQJjaLrw_lpk8jOaKPgC0SB_tdRXDpjCPvHs6Q3jyQZq43L4G7_bqJpozWFojEZG56uuzeTfrQ08yTxuGO4KJE0Piy6Dy2tr3XP2Sik4yTreSM7nIyo0ehLzv5yTWDxLvVxHQWHAtj3w",
  },
  {
    rank: 3,
    rankColor: "text-amber-700",
    title: "Ta Ở Tiên Giới Nuôi Linh Thú",
    author: "Gián Khoan Chu",
    views: "321K lượt đọc",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-Dlh0J5zqa6NRM3KsCMi63P4WGtoxVmhRWQDrEX7UA9XE1QIyIjXgVTsGeIjwjbQu3dvFaz3xe9Ukg5Fa4cZPzmnFBZPjg8iwlVTnEkYdEZeZU9kA2dQ3sIyHcBk4n6A8ef1dHp1B15eMjdDwp0GLjjlkue70F5nW5R87ss0qe0g_EweKJRFJnnodCp_i0CH943wOvbH0PVOTGn_qf4Aq6LyhzwaIUWpgkAHRh0tNCpdzF2HEE_1vZw",
  },
];

const COMPACT_RANKS = [
  { rank: 4, title: "Thôn Phệ Tinh Không II", views: "436K" },
  { rank: 5, title: "Gió Thiền: Mùa Thu Tàn", views: "398K" },
  { rank: 6, title: "Tuyệt Thế Tà Hoàng", views: "315K" },
  { rank: 7, title: "Toàn Cầu Giáng Lâm", views: "235K" },
  { rank: 8, title: "Đại Việt Sơn Hà Ký", views: "214K" },
  { rank: 9, title: "Trấn Ma Cổ Tháp", views: "208K" },
  { rank: 10, title: "Trọng Sinh Làm Tỷ Phú", views: "196K" },
];

export const RankingsSidebar: React.FC = () => {
  const [tab, setTab] = useState<"week" | "month" | "all">("week");

  return (
    <div id="bang-xep-hang" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500 text-[20px]">emoji_events</span>
          <h3 className="font-bold text-slate-900 text-base tracking-tight">Bảng Xếp Hạng</h3>
        </div>
        <Link href="#the-loai" className="text-xs text-blue-600 font-semibold hover:underline">
          Đọc nhiều
        </Link>
      </div>

      {/* Timeframe tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold text-slate-600">
        <button
          type="button"
          onClick={() => setTab("week")}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            tab === "week" ? "bg-white shadow-xs text-blue-600" : "hover:text-slate-900"
          }`}
        >
          Tuần
        </button>
        <button
          type="button"
          onClick={() => setTab("month")}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            tab === "month" ? "bg-white shadow-xs text-blue-600" : "hover:text-slate-900"
          }`}
        >
          Tháng
        </button>
        <button
          type="button"
          onClick={() => setTab("all")}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            tab === "all" ? "bg-white shadow-xs text-blue-600" : "hover:text-slate-900"
          }`}
        >
          Tổng
        </button>
      </div>

      {/* Top 1 to 3 with thumbnails */}
      <div className="space-y-3 pb-3 border-b border-slate-100">
        {TOP_THREE.map((item) => (
          <div key={item.rank} className="flex items-center gap-3 group cursor-pointer">
            <span className={`w-5 text-center font-black text-base ${item.rankColor}`}>
              {item.rank}
            </span>
            <img
              alt={item.title}
              className="w-9 h-12 rounded-lg object-cover shadow-2xs group-hover:scale-105 transition-transform"
              src={item.cover}
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">{item.author}</p>
              <span className="text-[10px] text-blue-600 font-semibold">{item.views}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rank 4 to 10 Compact list */}
      <div className="divide-y divide-slate-100 text-xs pt-1">
        {COMPACT_RANKS.map((item) => (
          <div
            key={item.rank}
            className="py-2 flex items-center justify-between hover:bg-slate-50 px-1 rounded transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="w-4 text-center font-bold text-slate-400">{item.rank}</span>
              <span className="truncate font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                {item.title}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0 ml-2">{item.views}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

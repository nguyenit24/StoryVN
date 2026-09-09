"use client";

import React from "react";
import toast from "react-hot-toast";

export const VipPromoCard: React.FC = () => {
  const handleUpgradeVip = () => {
    toast.success("Gói VIP StoryVN Premium đang chuẩn bị mở bán đợt đặc biệt!");
  };

  return (
    <div className="bg-gradient-to-br from-neutral-900 via-stone-950 to-amber-950 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
          <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
          <span>VIP PREMIUM</span>
        </span>
        <span className="text-xs font-semibold text-amber-300">Chỉ 12.450đ/tháng</span>
      </div>

      {/* Title */}
      <h4 className="font-extrabold text-base mb-2">Đọc Vô Hạn Không Giới Hạn</h4>

      {/* Feature list */}
      <ul className="space-y-1.5 text-xs text-stone-300 mb-4">
        <li className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-amber-400 text-[14px]">check</span>
          <span>Mở khóa toàn bộ 50,000+ chương VIP</span>
        </li>
        <li className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-amber-400 text-[14px]">check</span>
          <span>Giảm 20% khi mua phiếu thưởng tác giả</span>
        </li>
        <li className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-amber-400 text-[14px]">check</span>
          <span>Tải về Offline đọc ở app di động</span>
        </li>
      </ul>

      {/* CTA Button */}
      <button
        type="button"
        onClick={handleUpgradeVip}
        className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
      >
        Nâng cấp VIP ngay
      </button>
    </div>
  );
};

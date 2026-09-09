"use client";

import React from "react";
import Link from "next/link";

export const AuthorStudioPromo: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
      {/* Glow effect */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left info */}
        <div className="space-y-3 max-w-xl">
          <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wider uppercase text-blue-300">
            CHƯƠNG TRÌNH ĐỘC QUYỀN 2024
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Viết Tiếp Giấc Mơ Cùng StoryVN
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            Chia sẻ nhuận bút tới 75%, bảo hộ bản quyền toàn diện tại Việt Nam, cùng xây dựng hệ tác
            phẩm kỳ ảo đỉnh cao đưa tác giả vươn tầm.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/me"
              className="px-5 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
            >
              Mở Studio Tác Giả
            </Link>
            <Link
              href="#chinh-sach"
              className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Tìm hiểu chính sách</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Right stats graphic */}
        <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 text-center w-full md:w-56 backdrop-blur-xs">
          <span className="text-[11px] font-medium text-slate-400 block mb-1">
            NHUẬN BÚT ĐÃ CHI TRẢ
          </span>
          <div className="text-2xl font-black text-amber-400 tracking-tight">4.2 Tỷ VNĐ</div>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <div className="w-1.5 h-3 bg-blue-500 rounded-xs"></div>
            <div className="w-1.5 h-4.5 bg-blue-400 rounded-xs"></div>
            <div className="w-1.5 h-6 bg-amber-400 rounded-xs"></div>
            <div className="w-1.5 h-7.5 bg-emerald-400 rounded-xs"></div>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Ước tính tăng trưởng 14%</span>
        </div>
      </div>
    </section>
  );
};

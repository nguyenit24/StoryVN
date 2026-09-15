"use client";

import React from "react";
import { PROFILE_AUTHOR_WORKS } from "@/modules/client/story/mockStories";

interface ProfileAuthorWorksProps {
  onAction: (msg: string) => void;
}

export const ProfileAuthorWorks: React.FC<ProfileAuthorWorksProps> = ({ onAction }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-lg text-slate-900 tracking-tight">
          Tác phẩm tiêu biểu &amp; Đang phát hành
        </h3>
        <a href="#" className="text-xs font-bold text-blue-600 hover:underline">
          Xem lịch sử xuất bản ›
        </a>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        {/* Featured Book */}
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="relative w-36 h-48 rounded-2xl overflow-hidden shadow-md shrink-0 bg-slate-900">
            <img
              src={PROFILE_AUTHOR_WORKS.featured.cover}
              alt={PROFILE_AUTHOR_WORKS.featured.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 bg-blue-600 text-white font-bold text-[9px] px-2 py-0.5 rounded">
              {PROFILE_AUTHOR_WORKS.featured.badge}
            </span>
            <span className="absolute bottom-2 left-2 bg-slate-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded">
              Tiên Hiệp
            </span>
          </div>

          <div className="space-y-2.5 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xl font-black text-slate-900">{PROFILE_AUTHOR_WORKS.featured.title}</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                {PROFILE_AUTHOR_WORKS.featured.rankBadge}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="text-amber-500 font-bold">★ {PROFILE_AUTHOR_WORKS.featured.rating}</span>
              <span>•</span>
              <span>{PROFILE_AUTHOR_WORKS.featured.latestChapter}</span>
              <span>•</span>
              <span className="text-slate-400">{PROFILE_AUTHOR_WORKS.featured.updatedAt}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
              {PROFILE_AUTHOR_WORKS.featured.synopsis}
            </p>

            <div className="grid grid-cols-3 bg-slate-50 rounded-2xl p-3 text-center text-xs">
              <div>
                <div className="font-black text-slate-900 text-base">{PROFILE_AUTHOR_WORKS.featured.stats.chapters}</div>
                <div className="text-[10px] text-slate-400">Số chương</div>
              </div>
              <div>
                <div className="font-black text-slate-900 text-base">{PROFILE_AUTHOR_WORKS.featured.stats.words}</div>
                <div className="text-[10px] text-slate-400">Tổng chữ</div>
              </div>
              <div>
                <div className="font-black text-slate-900 text-base">{PROFILE_AUTHOR_WORKS.featured.stats.reads}</div>
                <div className="text-[10px] text-slate-400">Lượt đọc</div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onAction("Mở giao diện viết tiếp Chương mới...")}
                className="bg-[#1d72fe] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Viết tiếp chương mới
              </button>
              <button
                type="button"
                onClick={() => onAction("Hiển thị báo cáo thống kê chi tiết")}
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer"
              >
                Thống kê chi tiết
              </button>
            </div>
          </div>
        </div>

        {/* Sub-works list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          {PROFILE_AUTHOR_WORKS.subWorks.map((book, idx) => (
            <div
              key={idx}
              className="flex gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-white hover:border-slate-200 transition-all"
            >
              <div className="relative w-16 h-22 rounded-xl overflow-hidden shrink-0 shadow-2xs">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                <span className="absolute top-1 left-1 bg-slate-900/90 text-white text-[8px] font-bold px-1 rounded">
                  {book.status}
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-blue-600">{book.genre}</span>
                    <span className="text-[9px] text-slate-400">{book.chapters}</span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 truncate mt-0.5">{book.title}</h5>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{book.desc}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                  <span className="text-amber-500 font-bold">★ {book.rating}</span>
                  <span className="text-blue-600 font-bold hover:underline cursor-pointer">Quản lý ›</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

"use client";

import React from "react";
import { PROFILE_AUTHOR_WORKS } from "@/modules/client/story/mockStories";

interface ProfileReadingSectionProps {
  onAction: (msg: string) => void;
}

export const ProfileReadingSection: React.FC<ProfileReadingSectionProps> = ({ onAction }) => {
  return (
    <div className="space-y-8">
      {/* Section: Reading history */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-bold text-base">📖</span>
            <h3 className="font-black text-base text-slate-900">Đang theo dõi &amp; Đọc gần đây</h3>
          </div>
          <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
            Tủ sách của tôi (32 tác phẩm)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROFILE_AUTHOR_WORKS.readingHistory.map((item, idx) => (
            <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</h4>
                <span className="text-[10px] text-slate-400">{item.progress}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Tiến độ: {item.percent}%</span>
                <button
                  type="button"
                  onClick={() => onAction(`Tiếp tục đọc ${item.title}...`)}
                  className="text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Đọc tiếp</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Achievements */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold text-base">🏆</span>
            <h3 className="font-black text-base text-slate-900">Huy hiệu &amp; Thành tựu vinh danh</h3>
          </div>
          <span className="text-xs font-medium text-slate-400">12/20 đã đạt</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PROFILE_AUTHOR_WORKS.achievements.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-2xs text-center space-y-1.5"
            >
              <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-lg ${item.color}`}>
                {item.icon}
              </div>
              <h5 className="font-bold text-xs text-slate-900">{item.title}</h5>
              <p className="text-[10px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

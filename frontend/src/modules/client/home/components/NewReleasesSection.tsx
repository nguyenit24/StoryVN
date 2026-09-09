"use client";

import React, { useState } from "react";

const NEW_ITEMS = [
  {
    id: "1",
    title: "Luận Kiếm Sơn...",
    genre: "ĐỒNG NHÂN",
    genreColor: "text-blue-600",
    desc: "Mang theo bí truyền Sơn Gia trong sinh...",
    author: "Mai Trung Kiệt",
    chapter: "C. 18",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOe9WEmbYADRqSua8-lC6SVSSxDVG-x3QHeecUqfbFb1ueNwOhgdEk6s7OzmQANbGUe4rDO2gkGtAShSfEdGuKTWsk8YSIr-rN4mpstTi8ZjenKc4qilx_Wx6ALBvmsmkDq1fUFoL2qIkAgyolfezGtFXKMeo_skwiUObWQ5rIqn8U2ZhIGM0JXwqdxkcW1LMXkTgGTPr9boyB339aQy9M7Fo_-iIeVKl6CzWhie5jl6kZBjvdWcR3YQ",
  },
  {
    id: "2",
    title: "Thanh Khâu...",
    genre: "HUYỀN HUYỄN",
    genreColor: "text-purple-600",
    desc: "Truyền thuyết với mối tình cửu vĩ hồ...",
    author: "Lạc Vũ Thiên",
    chapter: "C. 35",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdP4nOJflDJEk8X7Zt3u9VfRRZ9Hdb54kgVJbNKKQTlHpplgwzNBGnT2UuEAn1ZsSV59wzlpw_cjjcdb9KHaHQy5IB3wHT-vdF957lonFfXE2G2-RM9hcdyoxWcpxsVlmUuLDYmCd1Blmc0pU9GWn8Gz0ifa96ZhE89kXxdodcIO7xdZ6v74OsqbRWHwmep6n7gRvJQgGhSg9uMrKyt9L0SLBZ_1d30maQRJurRyCu_n7mtRmDULZycA",
  },
  {
    id: "3",
    title: "Hợp Đồng Ti...",
    genre: "ĐÔ THỊ",
    genreColor: "text-amber-600",
    desc: "Cuộc hôn nhân giả định gian nan giữa...",
    author: "Hạ Hạ",
    chapter: "C. 12",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnyQlcWcOEmmj9oQtYxEGTuRRhTpdg2Su9_rOKxvbSVMDVq6FAHD741f8yazq4o6PhEvFlNhUIH1N3hRCizKk1fTynOewmSKmLH_Fp62tedXmJvJ7HkB0UDFMIK4wWwel-ItzdVagMpzMXKbAFDrYT98BMSngafk_KGpZjVdvnuBtP-b6CXsYYOG2iy4Aj-jZfIMpbOQyHHVOvAtpG80o_Dbjv2bKB5kXCrN2x92-Klay-jWxZsw3b4Q",
  },
];

export const NewReleasesSection: React.FC = () => {
  const [page, setPage] = useState(0);

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-extrabold rounded-md tracking-wider uppercase">
            NEW
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Truyện Mới Ra Mắt</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Trước"
          >
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Kế tiếp"
          >
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* 3-Column Horizontal Novel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {NEW_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all flex items-center gap-3 cursor-pointer group"
          >
            <img
              alt={item.title}
              className="w-16 h-22 rounded-xl object-cover shadow-2xs shrink-0 group-hover:scale-102 transition-transform"
              src={item.cover}
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="flex-1 min-w-0">
              <span className={`text-[10px] font-bold uppercase ${item.genreColor}`}>
                {item.genre}
              </span>
              <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.desc}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate">{item.author}</span>
                <span className="font-semibold text-slate-600 shrink-0">{item.chapter}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

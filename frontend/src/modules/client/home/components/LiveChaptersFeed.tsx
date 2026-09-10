"use client";

import React, { useState } from "react";
import Link from "next/link";

const LIVE_CHAPTERS_DATA = [
  {
    id: "1",
    genre: "Tiên Hiệp",
    genreBg: "bg-blue-50",
    genreText: "text-blue-600",
    title: "Đại Đạo Tranh Phong",
    chapter: "Chương 1284: Nhất Kiếm định...",
    author: "Ngộ Đạo Giả",
    time: "1 phút trước",
  },
  {
    id: "2",
    genre: "Huyền Huyễn",
    genreBg: "bg-purple-50",
    genreText: "text-purple-600",
    title: "Mục Thần Ký Cương",
    chapter: "Chương 781: Đại Chu Thiên ...",
    author: "Trư Đẩu Thần",
    time: "2 phút trước",
  },
  {
    id: "3",
    genre: "Đô Thị",
    genreBg: "bg-amber-50",
    genreText: "text-amber-600",
    title: "Thần Y Xuống Núi",
    chapter: "Chương 212: Cứu Người Bản...",
    author: "Tiêu Diệp",
    time: "6 phút trước",
  },
  {
    id: "4",
    genre: "Khoa Huyễn",
    genreBg: "bg-cyan-50",
    genreText: "text-cyan-600",
    title: "Thôn Phệ Tinh Không II",
    chapter: "Chương 490: Trở Về Trái Cà...",
    author: "Ngã Cật Tây Hồng Thị",
    time: "11 phút trước",
  },
  {
    id: "5",
    genre: "Trọng Sinh",
    genreBg: "bg-rose-50",
    genreText: "text-rose-600",
    title: "Sau Khi Trùng Sinh Tôi Cộ...",
    chapter: "Chương 84: Lời Hứa Dưới Mây",
    author: "Thanh Thanh Tô",
    time: "22 phút trước",
  },
  {
    id: "6",
    genre: "Võng Du",
    genreBg: "bg-emerald-50",
    genreText: "text-emerald-600",
    title: "Toàn Chức Pháp Sư: Thần...",
    chapter: "Chương 1320: Lôi Hệ Bá Thể",
    author: "Loạn",
    time: "30 phút trước",
  },
  {
    id: "7",
    genre: "Đồng Nhân",
    genreBg: "bg-indigo-50",
    genreText: "text-indigo-600",
    title: "Hải Tặc chi Thần Cấp Trùm Cuối",
    chapter: "Chương 342: Bá Khí Vô Hạn",
    author: "Hỏa Vũ",
    time: "35 phút trước",
  },
  {
    id: "8",
    genre: "Lịch Sử",
    genreBg: "bg-stone-100",
    genreText: "text-stone-700",
    title: "Đại Đường Đệ Nhất Thế Gia",
    chapter: "Chương 890: Bình Định Biên Giới",
    author: "Đình Viễn",
    time: "42 phút trước",
  },
];

export const LiveChaptersFeed: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const displayedRows = showAll ? LIVE_CHAPTERS_DATA : LIVE_CHAPTERS_DATA.slice(0, 6);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500 text-[20px]">bolt</span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Mới Lên Chương (Trực Tiếp)
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Tự động cập nhật</span>
        </div>
      </div>

      {/* Table-like List for Chapter Feed */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
            <tr>
              <th className="py-2.5 px-3">Thể loại</th>
              <th className="py-2.5 px-3">Tên truyện</th>
              <th className="py-2.5 px-3">Chương mới</th>
              <th className="py-2.5 px-3">Tác giả / Dịch giả</th>
              <th className="py-2.5 px-3 text-right">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {displayedRows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded ${row.genreBg} ${row.genreText}`}
                  >
                    {row.genre}
                  </span>
                </td>
                <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                  <Link href="#the-loai" className="hover:text-blue-600 transition-colors">
                    {row.title}
                  </Link>
                </td>
                <td className="py-3 px-3 text-blue-600 font-medium whitespace-nowrap">
                  <Link href="#the-loai" className="hover:underline">
                    {row.chapter}
                  </Link>
                </td>
                <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{row.author}</td>
                <td className="py-3 px-3 text-right text-slate-400 text-xs whitespace-nowrap">
                  {row.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View more button */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <span>{showAll ? "Thu gọn danh sách" : "Xem thêm cập nhật"}</span>
          <span
            className={`material-symbols-outlined text-[16px] transition-transform ${
              showAll ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </button>
      </div>
    </section>
  );
};

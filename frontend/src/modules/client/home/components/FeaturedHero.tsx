"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

const FEATURED_STORIES = [
  {
    id: "01",
    num: "01",
    navTitle: "01. Vạn Cổ Đệ Nhất Thần Long",
    title: "Vạn Cổ Đệ Nhất Thần Long",
    tag: "Top 1 Thịnh Hành",
    genre: "Tiên Hiệp Kỳ Ảo",
    chapters: "Đang ra 2.154 chương",
    author: "Phong Thanh Dương",
    rating: "4.9 / 5.0",
    reviews: "(18.8k đánh giá)",
    desc: "Lý Thiên Mệnh điều khiển mười đại Thái Cổ Hỗn Độn Cự Thú, từ Thần Lăng Hoàng Tộc bước ra, phá vỡ thiên địa gông xiềng. Đấu chư vạn thiên, bình định chư giới vạn vực, ngẩng đoạt thiên mệnh!",
    tags: ["Hệ Thống", "Vô Địch Lưu", "Hài Hước", "Đặc Phái Quyền Đoàn"],
    views: "3.8M+",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDYuYMB1LCIP9hdRBjf2Fe35P1iLHsVMn28E1-g5i5tr6J_6V87t5_kgH-K_6be5wDxS_VngY__McXv8jZ0p17mvLZw_dSp7u97xCL05fnDdpuLWn0kXkBDSBOwIxbBtva8yW28hrs-EeySd8SkgIBP2FtfGoBfY0CoJbomrVd8FBdEM-Iu7R2dGuDpuGxphZA3KhlOpzcF1xGXPNRBZArEnVrFQHWjKnMqMlEJfHeM8XAFiCkkJeUp1A",
  },
  {
    id: "02",
    num: "02",
    navTitle: "02. Đỉnh Cao Đệ Nhất Tiên",
    title: "Đỉnh Cao Đệ Nhất Tiên",
    tag: "Top 2 Nổi Bật",
    genre: "Kiếm Đạo Tu Chân",
    chapters: "Đang ra 1.840 chương",
    author: "Tiêu Dao Thần",
    rating: "4.8 / 5.0",
    reviews: "(14.2k đánh giá)",
    desc: "Một kiếm phá vạn pháp, đạp khắp cửu thiên thập địa tìm kiếm đại đạo vô thượng. Kiếm chỉ nơi đâu, chư thần chư ma đều phải cúi đầu!",
    tags: ["Kiếm Tu", "Nhiệt Huyết", "Sát Phạt", "Đơn Nữ Chính"],
    views: "2.9M+",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0gNLBv8iHWpD1-mv6mr5vXR1hBHtRmQIO9LnmdiTXSe1kmqVh3AB9e1fNnYsPaJcQFrYImu1hsYMeMXpMnDdv1Pu6BUcNgY0EClruiarKWeCQJjaLrw_lpk8jOaKPgC0SB_tdRXDpjCPvHs6Q3jyQZq43L4G7_bqJpozWFojEZG56uuzeTfrQ08yTxuGO4KJE0Piy6Dy2tr3XP2Sik4yTreSM7nIyo0ehLzv5yTWDxLvVxHQWHAtj3w",
  },
  {
    id: "03",
    num: "03",
    navTitle: "03. Ta Ở Tiên Giới Nuôi Linh Thú",
    title: "Ta Ở Tiên Giới Nuôi Linh Thú",
    tag: "Top 3 Đề Cử",
    genre: "Điền Viên Tu Tiên",
    chapters: "Đang ra 950 chương",
    author: "Giản Khoan Chu",
    rating: "4.8 / 5.0",
    reviews: "(9.6k đánh giá)",
    desc: "Xuyên việt đến thế giới tu tiên nhưng không thích chém giết, chỉ muốn làm nông nuôi dưỡng thần thú, vô tình nuôi ra cả đàn tiên đế.",
    tags: ["Nuôi Thú", "Nhẹ Nhàng", "Hài Hước", "Làm Ruộng"],
    views: "2.1M+",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-Dlh0J5zqa6NRM3KsCMi63P4WGtoxVmhRWQDrEX7UA9XE1QIyIjXgVTsGeIjwjbQu3dvFaz3xe9Ukg5Fa4cZPzmnFBZPjg8iwlVTnEkYdEZeZU9kA2dQ3sIyHcBk4n6A8ef1dHp1B15eMjdDwp0GLjjlkue70F5nW5R87ss0qe0g_EweKJRFJnnodCp_i0CH943wOvbH0PVOTGn_qf4Aq6LyhzwaIUWpgkAHRh0tNCpdzF2HEE_1vZw",
  },
  {
    id: "04",
    num: "04",
    navTitle: "04. Cổ Điểm: Nàng Ám Chúa Mùa",
    title: "Cổ Điểm: Nàng Ám Chúa Mùa",
    tag: "Top 4 Yêu Thích",
    genre: "Huyền Huyễn Kỳ Bí",
    chapters: "Đang ra 680 chương",
    author: "Bắc Hải Nhạn",
    rating: "4.7 / 5.0",
    reviews: "(7.1k đánh giá)",
    desc: "Mùa đông vĩnh cửu bao trùm vương quốc, thiếu nữ mang trong mình ngọn lửa cấm kỵ thức tỉnh giữa bóng đêm của những vị cổ thần.",
    tags: ["Ma Pháp", "Nữ Cường", "Âm Mưu", "Phương Tây"],
    views: "1.6M+",
    cover:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8mnNQvyA-XeYMt0x0mPRgGeUh4faB6ZeaSt4g2SLixnRSKSSqe555Swce9o65VqsjoVgAWPgoCh3JkKiMDIOv-cO31TM6R7AL2PBEoGIql_XV7T4tMNd4nhMhSfWorH9YqssDjhWab-HxrxWLigzX18lAN0W2ubAbE9TiDsVIVzA0rmJ2-jDG8Ew-X3KIBDSX-YKVm8R74Y5KSBfYRNqdchm-VUqoO08KgKkUzp0kCgRGQLMz_Pwudw",
  },
];

export const FeaturedHero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const story = FEATURED_STORIES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : FEATURED_STORIES.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < FEATURED_STORIES.length - 1 ? prev + 1 : 0));
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết truyện vào bộ nhớ tạm!");
    }
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(!bookmarked ? "Đã thêm vào Tủ sách thành công!" : "Đã gỡ khỏi Tủ sách");
  };

  return (
    <section className="relative bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border border-blue-100/70 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs overflow-hidden">
      {/* Background subtle ornament */}
      <div className="absolute -right-24 -top-24 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left info */}
        <div className="lg:col-span-8 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
              <span className="material-symbols-outlined text-[14px]">emoji_events</span>
              <span>{story.tag}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-700">
              {story.genre}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-blue-600">
              {story.chapters}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight transition-all duration-300">
            {story.title}
          </h1>

          {/* Meta Author & Rating */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 font-medium">
            <span className="text-slate-900 font-semibold">{story.author}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <div className="flex items-center text-amber-500 font-bold gap-1">
              <span className="material-symbols-outlined text-[16px] fill-current">star</span>
              <span>{story.rating}</span>
            </div>
            <span className="text-slate-400 font-normal">{story.reviews}</span>
          </div>

          {/* Description */}
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base max-w-2xl font-normal line-clamp-3">
            {story.desc}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/me`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>Đọc ngay C.1</span>
            </Link>

            <button
              type="button"
              onClick={toggleBookmark}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-colors shadow-xs cursor-pointer ${
                bookmarked
                  ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold"
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {bookmarked ? "bookmark_added" : "bookmark"}
              </span>
              <span>{bookmarked ? "Đã trong Tủ sách" : "Thêm vào Tủ sách"}</span>
            </button>

            <button
              onClick={handleShare}
              className="w-11 h-11 inline-flex items-center justify-center rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-colors shadow-xs cursor-pointer"
              title="Chia sẻ"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
          </div>
        </div>

        {/* Right: Book Cover Spotlight */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div className="relative group">
            {/* HOT Badge */}
            <span className="absolute -top-3 -left-3 z-20 px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold uppercase rounded shadow-md tracking-wider">
              HOT
            </span>

            {/* Poster Card */}
            <div className="w-56 h-80 sm:w-64 sm:h-92 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 relative">
              <img
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src={story.cover}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              {/* Overlay reading stats */}
              <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-xl flex items-center justify-between text-xs text-slate-800 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="font-bold text-slate-900">{story.views}</span>
                </div>
                <span className="text-slate-500 text-[11px]">Lượt đọc kỳ này</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Chapter Navigator Footer inside Hero */}
      <div className="mt-8 pt-6 border-t border-blue-100/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {FEATURED_STORIES.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                idx === currentIndex
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {item.navTitle}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            aria-label="Truyện trước"
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          </button>
          <button
            onClick={handleNext}
            aria-label="Truyện kế tiếp"
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
};

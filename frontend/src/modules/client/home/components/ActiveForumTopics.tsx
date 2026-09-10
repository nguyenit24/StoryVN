"use client";

import React from "react";
import Link from "next/link";

const FORUM_TOPICS = [
  {
    id: "1",
    tag: "Thảo luận",
    tagColor: "text-blue-600",
    time: "12 phút trước",
    title: "Dự đoán đại kết cục Vạn Cổ Đệ Nhất Thần Long: Liệu Thiên Mệnh có đạt p...",
    author: "Độc Giả 99",
    comments: 342,
  },
  {
    id: "2",
    tag: "Chia sẻ",
    tagColor: "text-emerald-600",
    time: "45 phút trước",
    title: "Kinh nghiệm xây dựng hệ thống tu luyện cho người mới bắt đầu sáng tác tiểu...",
    author: "Hội Tác Thanh Lam",
    comments: 146,
  },
  {
    id: "3",
    tag: "Review",
    tagColor: "text-amber-600",
    time: "2 giờ trước",
    title: "Top 5 bộ truyện Huyền Huyễn có văn phong cuốn hút nhất quý 1 năm nay",
    author: "Bình Bạch Cô",
    comments: 87,
  },
];

export const ActiveForumTopics: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-600 text-[20px]">
            chat_bubble
          </span>
          <h3 className="font-bold text-slate-900 text-base tracking-tight">Diễn Đàn Sôi Nổi</h3>
        </div>
        <Link href="/dien-dan" className="text-xs text-blue-600 font-semibold hover:underline">
          Xem thêm
        </Link>
      </div>

      {/* Topics list */}
      <div className="space-y-3.5">
        {FORUM_TOPICS.map((topic) => (
          <article
            key={topic.id}
            className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span className={`font-semibold ${topic.tagColor}`}>{topic.tag}</span>
              <span>{topic.time}</span>
            </div>

            <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {topic.title}
            </h4>

            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>{topic.author}</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">mode_comment</span>
                <span>{topic.comments} bình luận</span>
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

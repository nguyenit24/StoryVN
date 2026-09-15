"use client";

import React from "react";

export const ForumSidebar: React.FC = () => {
  const relatedTopics = [
    "Nghệ thuật gieo \"Foreshadowing\" để độc giả không đoán trước kết cục",
    "Cách viết những đoạn miêu tả võ công vô kiếm pháp mượt mà, gãy gọn",
    "Cân bằng nhịp độ truyện: Khi nào nên dồn dập, khi nào nên lắng đọng?",
    "Cách tạo plot twist logic có động cơ hợp lý nhờ kỹ thuật bài binh bố trận",
    "Chuyển thể ngữ trong dịch thuật sang văn phong thuần Việt tự nhiên",
  ];

  const featuredAuthors = [
    { name: "Thiên Đạo Triết Xuất", stats: "14 bài viết • 32.4k điểm" },
    { name: "Tử Vân Ca Chủ", stats: "9 bài viết • 21.1k điểm" },
    { name: "Độc Cô Cường Ái", stats: "18 bài viết • 19.8k điểm" },
  ];

  return (
    <aside className="lg:col-span-4 space-y-6">
      {/* Write new post banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white space-y-3 shadow-md">
        <h4 className="font-black text-sm">Bạn có kinh nghiệm muốn chia sẻ?</h4>
        <p className="text-xs text-blue-100 leading-relaxed">
          Nhận điểm uy tín và hỗ trợ cộng đồng tác giả trẻ StoryVN phát triển.
        </p>
        <button
          type="button"
          className="w-full py-2.5 bg-white hover:bg-slate-50 text-blue-600 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          ✏️ Đăng bài viết mới
        </button>
      </div>

      {/* Related topics */}
      <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-sm text-slate-900">Chủ đề cùng chuyên mục</h4>
          <a href="#" className="text-[11px] text-blue-600 font-bold hover:underline">Xem tất cả</a>
        </div>
        <ul className="space-y-3 text-xs">
          {relatedTopics.map((item, idx) => (
            <li key={idx} className="pb-2.5 border-b border-slate-50 last:border-0 last:pb-0">
              <a href="#" className="font-semibold text-slate-800 hover:text-blue-600 line-clamp-2 transition-colors">{item}</a>
              <div className="text-[10px] text-slate-400 mt-1">12 giờ trước • 34 thảo luận</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Featured authors */}
      <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h4 className="font-black text-sm text-slate-900">Tác giả nổi bật tuần này</h4>
        <div className="space-y-3">
          {featuredAuthors.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">{item.name}</div>
                <div className="text-[10px] text-slate-400">{item.stats}</div>
              </div>
              <button type="button" className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">+</button>
            </div>
          ))}
        </div>
      </div>

      {/* Forum rules */}
      <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-2 text-xs">
        <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
          <span>🛡️</span> Nội quy diễn đàn StoryVN
        </h5>
        <ul className="text-slate-500 space-y-1 text-[11px] list-disc pl-4">
          <li>Tôn trọng quyền tác giả và bản quyền bài viết.</li>
          <li>Không spam hoặc đăng liên kết quảng cáo trục lợi.</li>
          <li>Hành xử văn minh, góp ý mang tính xây dựng.</li>
        </ul>
      </div>
    </aside>
  );
};

"use client";

import React from "react";

interface Comment {
  id: number;
  author: string;
  badge: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  replies: {
    id: number;
    author: string;
    badge: string;
    avatar: string;
    time: string;
    content: string;
    likes: number;
  }[];
}

interface ForumCommentSectionProps {
  commentsList: Comment[];
  commentText: string;
  onCommentTextChange: (v: string) => void;
  onPostComment: (e: React.FormEvent) => void;
}

export const ForumCommentSection: React.FC<ForumCommentSectionProps> = ({
  commentsList,
  commentText,
  onCommentTextChange,
  onPostComment,
}) => {
  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-lg text-slate-900">Thảo luận ({commentsList.length + 144})</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-blue-600">Mới nhất</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 hover:text-slate-800 cursor-pointer">Nổi bật nhất</span>
        </div>
      </div>

      {/* Comment Input */}
      <form onSubmit={onPostComment} className="space-y-3">
        <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
          <div className="p-2 border-b border-slate-100 flex items-center gap-2 text-slate-400 text-xs bg-slate-50">
            <button type="button" className="px-1.5 py-0.5 hover:bg-slate-200 rounded font-bold text-slate-700">B</button>
            <button type="button" className="px-1.5 py-0.5 hover:bg-slate-200 rounded italic text-slate-700">I</button>
            <button type="button" className="px-1.5 py-0.5 hover:bg-slate-200 rounded text-slate-700">🔗</button>
            <button type="button" className="px-1.5 py-0.5 hover:bg-slate-200 rounded text-slate-700">📷</button>
            <button type="button" className="px-1.5 py-0.5 hover:bg-slate-200 rounded text-slate-700">&lt;/&gt;</button>
          </div>
          <textarea
            rows={3}
            placeholder="Chia sẻ quan điểm hoặc đặt câu hỏi cho Thanh Lam Tiên Sinh..."
            value={commentText}
            onChange={(e) => onCommentTextChange(e.target.value)}
            className="w-full p-3 text-xs text-slate-800 outline-none resize-none placeholder:text-slate-400"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#1d72fe] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            Gửi bình luận
          </button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4 pt-2">
        {commentsList.map((cmt) => (
          <div key={cmt.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={cmt.avatar} alt={cmt.author} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>{cmt.author}</span>
                    <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">{cmt.badge}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{cmt.time}</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed pl-10">{cmt.content}</p>

            <div className="flex items-center gap-4 pl-10 text-[11px] text-slate-400">
              <button type="button" className="hover:text-blue-600 font-semibold cursor-pointer">👍 {cmt.likes}</button>
              <button type="button" className="hover:text-blue-600 font-semibold cursor-pointer">Trả lời</button>
            </div>

            {/* Replies */}
            {cmt.replies && cmt.replies.length > 0 && (
              <div className="ml-10 mt-3 pl-4 border-l-2 border-blue-200 space-y-3">
                {cmt.replies.map((rep) => (
                  <div key={rep.id} className="space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <img src={rep.avatar} alt={rep.author} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-xs text-slate-900">{rep.author}</span>
                      <span className="text-[8px] bg-amber-100 text-amber-800 font-bold px-1.5 rounded">{rep.badge}</span>
                      <span className="text-[10px] text-slate-400 ml-auto">{rep.time}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{rep.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <button
          type="button"
          className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition-all cursor-pointer"
        >
          Xem thêm 143 bình luận khác ∨
        </button>
      </div>
    </div>
  );
};

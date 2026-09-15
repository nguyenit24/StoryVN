"use client";

import React, { useState } from "react";
import { ClientHeader } from "@/components/layout/ClientHeader";
import { ClientFooter } from "@/components/layout/ClientFooter";
import { ForumPostHeader } from "./ForumPostHeader";
import { ForumPostContent } from "./ForumPostContent";
import { ForumCommentSection } from "./ForumCommentSection";
import { ForumSidebar } from "./ForumSidebar";

const INITIAL_COMMENTS = [
  {
    id: 1,
    author: "Minh Triết Đạo Nhân",
    badge: "ĐỘC GIẢ VÀNG",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    time: "40 phút trước",
    content:
      "Bài viết cực kỳ tâm huyết! Em sinh hoạt bên thể loại Huyền Huyễn đã lâu nhưng nhiều lúc MC qua map mới là nát cảnh giới, mất hết cái uy cũ. Thêm vụ Lôi Kiếp tự nhiên và Cái Giá Cảnh Giới vào bài viết này quá chí mạng! Bác có thêm gợi ý nào cho việc MC ngưng tụ Đan sa không ạ?",
    likes: 44,
    replies: [
      {
        id: 11,
        author: "Thanh Lam Tiên Sinh",
        badge: "TÁC GIẢ BÀI VIẾT",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        time: "28 phút trước",
        content:
          "@Minh Triết Đạo Nhân: Mục thiếu sót ở Cổ Điển hay nằm ở động cơ hành vi và hiểm họa xung quanh. Mỗi phẩm cấp đan sa nên gắn liền một biến thiên trong tâm cảnh, không nên chỉ là số chữ đơn thuần. Chúc bạn thành công!",
        likes: 21,
      },
    ],
  },
  {
    id: 2,
    author: "Lạc Vũ Dạ Nguyệt",
    badge: "TÁC GIẢ TIÊN HIỆP",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    time: "1 giờ trước",
    content:
      "Bảng quy chuẩn 5 đại cảnh giới quá chi tiết! Cảm ơn bác đã chia sẻ. Tác giả mới như em đọc vào thấy thông não bao nhiêu nút thắt. Mong chờ bài tiếp theo về xây dựng thế lực Tông Môn và Gia Tộc.",
    likes: 19,
    replies: [],
  },
];

export default function ForumPostPage() {
  const [likesCount, setLikesCount] = useState(342);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(INITIAL_COMMENTS);

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount(likesCount + 1);
      setHasLiked(true);
    } else {
      setLikesCount(likesCount - 1);
      setHasLiked(false);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: "Bạn (Độc giả)",
      badge: "THÀNH VIÊN",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      time: "Vừa xong",
      content: commentText.trim(),
      likes: 1,
      replies: [],
    };
    setCommentsList([newComment, ...commentsList]);
    setCommentText("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      <ClientHeader />

      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        <ForumPostHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Article */}
          <article className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6">
            <ForumPostContent
              likesCount={likesCount}
              hasLiked={hasLiked}
              onLike={handleLike}
            />
            <ForumCommentSection
              commentsList={commentsList}
              commentText={commentText}
              onCommentTextChange={setCommentText}
              onPostComment={handlePostComment}
            />
          </article>

          {/* Right Column: Sidebar */}
          <ForumSidebar />
        </div>
      </main>

      <ClientFooter />
    </div>
  );
}

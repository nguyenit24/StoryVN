"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClientHeader } from "@/components/layout/ClientHeader";
import { ClientFooter } from "@/components/layout/ClientFooter";

export default function ForumPostPage() {
  const [likesCount, setLikesCount] = useState(342);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([
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
  ]);

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
      {/* ==================== 1. SHARED UNIFIED CLIENT HEADER ==================== */}
      <ClientHeader />

      {/* ==================== 2. FORUM POST BODY ==================== */}
      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* Breadcrumb matching Image 4 */}
        <nav className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/dien-dan" className="hover:text-blue-600">
            Diễn đàn
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Kinh nghiệm sáng tác</span>
          <span>/</span>
          <span className="text-slate-400 truncate max-w-xs">
            Làm sao để xây dựng hệ thống tu luyện logic mà không bị loãng mạch truyện?
          </span>
        </nav>

        {/* 2-Column Forum Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ==================== LEFT COLUMN: ARTICLE CONTENT (8 cols) ==================== */}
          <article className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6">
            {/* Tags row */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
              <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200 uppercase">
                KINH NGHIỆM SÁNG TÁC
              </span>
              <span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md border border-orange-200 uppercase">
                THIẾT KẾ TIÊN HIỆP
              </span>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                Tiêu điểm
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Làm sao để xây dựng hệ thống tu luyện logic mà không bị loãng mạch truyện?
            </h1>

            {/* Author bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Thanh Lam Tiên Sinh"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Thanh Lam Tiên Sinh</span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                      BIÊN TẬP VIÊN
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Đăng 14:20 • 28/05/2024 • <span className="text-blue-600 font-semibold">4.8k đọc</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 flex items-center gap-1.5 text-xs cursor-pointer"
              >
                <span>🔖 Lưu bài viết</span>
              </button>
            </div>

            {/* Article Body Content matching Image 4 */}
            <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-5">
              <p className="first-letter:text-5xl first-letter:font-black first-letter:text-blue-600 first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                Trong suốt 7 năm viết tiểu thuyết Tiên Hiệp và Huyền Huyễn, câu hỏi tôi nhận được nhiều nhất từ các tác giả mới ở StoryVN là: Làm thế nào để thiết kế một hệ thống tu luyện vừa có chiều sâu, mang tính độc đáo mà không bị lặp lại những khuôn sáo cũ, đồng thời nhân vật chính leo rank không làm loãng mạch truyện?
              </p>

              <p>
                Hôm nay, xin chia sẻ cùng anh em diễn đàn 3 quy tắc then chốt mà tôi đúc kết qua hơn 10 triệu chữ cùng các tác phẩm đạt giải Sáng Tác Vàng tại StoryVN.
              </p>

              {/* Section 1 */}
              <h2 className="text-lg font-black text-slate-900 pt-2 border-l-4 border-blue-600 pl-3">
                1. Quy tắc tam giới và phân tầng năng lượng
              </h2>
              <p>
                Sai lầm lớn nhất của nhiều tác giả mới là vừa vào truyện đã cho xuất hiện quá nhiều &ldquo;Thần Ma&rdquo;, &ldquo;Chân Thần&rdquo; cùng các tuyệt kỹ huỷ diệt tinh cầu. Khi đó, cảm giác uy lực bị hạ thấp rất nhanh. Hãy bắt đầu từ việc thiết lập phân tầng năng lượng có ranh giới rõ ràng.
              </p>

              {/* Callout Quote Box */}
              <div className="bg-blue-50/70 border-l-4 border-blue-600 rounded-r-2xl p-4 my-4">
                <p className="italic text-slate-800 font-medium text-xs sm:text-sm">
                  “Một hệ thống tu chân vững vàng không do đẳng cấp các bạn nghĩ ra, mà do bằng chứng một người tu sĩ trước phải chiến đấu đổi mới nâng cấp cảnh giới!”
                </p>
                <div className="text-[11px] font-semibold text-slate-500 mt-1">
                  — Trích từ Sổ tay biên tập viên StoryVN / BTV Lâm Trúc
                </div>
              </div>

              {/* Section 2 */}
              <h2 className="text-lg font-black text-slate-900 pt-2 border-l-4 border-blue-600 pl-3">
                2. Thiết lập giới hạn và cái giá của sức mạnh
              </h2>
              <p>
                Nếu đột phá cảnh giới mà không phải trả bất kỳ giá nào thì sức mạnh trở nên rẻ rúng. Hãy thiết lập 3 yếu tố cân bằng:
              </p>

              {/* 3 Boxes matching Image 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                  <div className="font-black text-xs text-blue-800 flex items-center gap-1.5">
                    <span>🔮</span> Tâm Ma Trắc Nghiệm
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Đột phá cảnh giới cao luôn đi kèm với việc thử thách tâm ma, nếu đạo tâm sụp đổ sẽ tẩu hỏa nhập ma.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                  <div className="font-black text-xs text-purple-800 flex items-center gap-1.5">
                    <span>⚡</span> Lôi Kiếp Tự Nhiên
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Nghịch thiên đoạt huyền cơ bị thiên kiếp nhắm vào, tỷ lệ đan tan ngọc nát cực kỳ cao.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                  <div className="font-black text-xs text-amber-800 flex items-center gap-1.5">
                    <span>⏳</span> Cái Giá Cảnh Giới
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Nếu không trả giá thỏa đáng tuổi thọ cạn kiệt, vĩnh viễn không thể siêu thoát luân hồi.
                  </p>
                </div>
              </div>

              {/* Table of Cultivation Realms (Exact Match to Image 4) */}
              <div className="space-y-2 my-6">
                <h3 className="font-black text-sm text-slate-900">
                  Bảng quy chuẩn năng lượng 5 đại cảnh giới cơ bản
                </h3>
                <div className="border border-slate-200 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                        <th className="py-2.5 px-3 uppercase">Cảnh giới</th>
                        <th className="py-2.5 px-3 uppercase">Bản chất linh khí</th>
                        <th className="py-2.5 px-3 uppercase">Thọ nguyên</th>
                        <th className="py-2.5 px-3 uppercase">Năng lực đại biểu</th>
                        <th className="py-2.5 px-3 uppercase">Cái giá khi thất bại</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal text-xs">
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-blue-700">Luyện Khí (1-9 Tầng)</td>
                        <td className="py-2.5 px-3">Khí ngưng phỏng manh, di chuyển trong kinh mạch</td>
                        <td className="py-2.5 px-3 font-mono">100 - 150 năm</td>
                        <td className="py-2.5 px-3">Nhãn quang, ngự vật sơ khai</td>
                        <td className="py-2.5 px-3 text-red-600">Kinh mạch tổn thương nhẹ</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-blue-700">Trúc Cơ (Sơ - Hậu)</td>
                        <td className="py-2.5 px-3">Đan điền tích ngưng tụ, xây dựng đạo thai</td>
                        <td className="py-2.5 px-3 font-mono">200 - 350 năm</td>
                        <td className="py-2.5 px-3">Ngự kiếm phi hành, chân hỏa xuất phát</td>
                        <td className="py-2.5 px-3 text-red-600">Đan tan phế mạch, tụt về phàm phu</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-blue-700">Kim Đan (Cửu Phẩm)</td>
                        <td className="py-2.5 px-3">Cố hóa Kim Đan, ngưng tụ pháp tượng</td>
                        <td className="py-2.5 px-3 font-mono">500 - 800 năm</td>
                        <td className="py-2.5 px-3">Đại triệt đại ngộ, điều động nguyên khí</td>
                        <td className="py-2.5 px-3 text-red-600">Kim đan vỡ nát, hồn phi phách tán</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-blue-700">Nguyên Anh (Tiên Hóa)</td>
                        <td className="py-2.5 px-3">Thần hồn xuất khiếu, bất tử bất diệt</td>
                        <td className="py-2.5 px-3 font-mono">1,500 - 3,000 năm</td>
                        <td className="py-2.5 px-3">Di hình hoán ảnh, đoạt xá trùng sinh</td>
                        <td className="py-2.5 px-3 text-red-600">Nguyên thần tịch diệt bởi Cửu Trọng Lôi</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-blue-700">Hóa Thần (Quy Chân)</td>
                        <td className="py-2.5 px-3">Dung hợp Đạo tắc, thiên địa quy nhất</td>
                        <td className="py-2.5 px-3 font-mono">5,000 năm+</td>
                        <td className="py-2.5 px-3">Xé rách không gian, tạo lập thế giới</td>
                        <td className="py-2.5 px-3 text-red-600">Hóa đạo (tan biến vào thiên địa)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tip Box matching Image 4 */}
              <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2 text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span>💡</span> Mẹo thực chiến cho tác giả StoryVN:
                </div>
                <ul className="space-y-1.5 text-amber-900/90 pl-4 list-disc">
                  <li><b>Quy tắc &ldquo;Tiền vào sau đến trước&rdquo;:</b> Nhân vật chính không cần lúc nào cũng nhặt được bảo vật mạnh nhất; hãy biến thử thách thành cơ hội tôi luyện.</li>
                  <li><b>Thông số đừng quá ảo tưởng:</b> Hãy bám sát vào quy luật nội tại của thế giới tu tiên.</li>
                  <li><b>Khởi nghiệp tĩnh lặng:</b> Dành ít nhất 20-30 chương đầu để xây dựng bối cảnh và mâu thuẫn giai cấp vững chắc.</li>
                </ul>
              </div>

              {/* Hash tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["#xaydunghethong", "#kinhnghiemsangtac", "#tienhiep", "#sangtacstoryvn"].map((tag) => (
                  <span key={tag} className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Like & Share Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLike}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    hasLiked
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  <span>👍</span>
                  <span>Thích • {likesCount}</span>
                </button>

                <button
                  type="button"
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-xs cursor-pointer"
                >
                  🔖 Lưu bài viết
                </button>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <span>Chia sẻ:</span>
                <button type="button" className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                  🔗
                </button>
                <button type="button" className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                  💬
                </button>
              </div>
            </div>

            {/* Author Card Footer */}
            <div className="p-5 bg-slate-50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Thanh Lam Tiên Sinh"
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>Thanh Lam Tiên Sinh</span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                      BÚT VÀNG VINH DANH
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-md">
                    Tác giả của 3 tác phẩm đạt giải Sáng Tác Vàng tại StoryVN: Tiên Đạo Tranh Phong, Cửu Châu Tiên Mộng...
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
              >
                + Theo dõi tác giả
              </button>
            </div>

            {/* Comments / Discussion Section */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-lg text-slate-900">
                  Thảo luận ({commentsList.length + 144})
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-blue-600">Mới nhất</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-500 hover:text-slate-800 cursor-pointer">Nổi bật nhất</span>
                </div>
              </div>

              {/* Rich comment input */}
              <form onSubmit={handlePostComment} className="space-y-3">
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
                    onChange={(e) => setCommentText(e.target.value)}
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
                            <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                              {cmt.badge}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">{cmt.time}</div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pl-10">
                      {cmt.content}
                    </p>

                    <div className="flex items-center gap-4 pl-10 text-[11px] text-slate-400">
                      <button type="button" className="hover:text-blue-600 font-semibold cursor-pointer">
                        👍 {cmt.likes}
                      </button>
                      <button type="button" className="hover:text-blue-600 font-semibold cursor-pointer">
                        Trả lời
                      </button>
                    </div>

                    {/* Replies */}
                    {cmt.replies && cmt.replies.length > 0 && (
                      <div className="ml-10 mt-3 pl-4 border-l-2 border-blue-200 space-y-3">
                        {cmt.replies.map((rep) => (
                          <div key={rep.id} className="space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2">
                              <img src={rep.avatar} alt={rep.author} className="w-6 h-6 rounded-full object-cover" />
                              <span className="font-bold text-xs text-slate-900">{rep.author}</span>
                              <span className="text-[8px] bg-amber-100 text-amber-800 font-bold px-1.5 rounded">
                                {rep.badge}
                              </span>
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
          </article>

          {/* ==================== RIGHT COLUMN: FORUM SIDEBAR (4 cols) ==================== */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Banner: Đăng bài mới */}
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

            {/* Chủ đề cùng chuyên mục */}
            <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm text-slate-900">Chủ đề cùng chuyên mục</h4>
                <a href="#" className="text-[11px] text-blue-600 font-bold hover:underline">
                  Xem tất cả
                </a>
              </div>

              <ul className="space-y-3 text-xs">
                {[
                  "Nghệ thuật gieo \"Foreshadowing\" để độc giả không đoán trước kết cục",
                  "Cách viết những đoạn miêu tả võ công vô kiếm pháp mượt mà, gãy gọn",
                  "Cân bằng nhịp độ truyện: Khi nào nên dồn dập, khi nào nên lắng đọng?",
                  "Cách tạo plot twist logic có động cơ hợp lý nhờ kỹ thuật bài binh bố trận",
                  "Chuyển thể ngữ trong dịch thuật sang văn phong thuần Việt tự nhiên",
                ].map((item, idx) => (
                  <li key={idx} className="pb-2.5 border-b border-slate-50 last:border-0 last:pb-0">
                    <a href="#" className="font-semibold text-slate-800 hover:text-blue-600 line-clamp-2 transition-colors">
                      {item}
                    </a>
                    <div className="text-[10px] text-slate-400 mt-1">12 giờ trước • 34 thảo luận</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tác giả nổi bật tuần này */}
            <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h4 className="font-black text-sm text-slate-900">Tác giả nổi bật tuần này</h4>
              <div className="space-y-3">
                {[
                  { name: "Thiên Đạo Triết Xuất", stats: "14 bài viết • 32.4k điểm" },
                  { name: "Tử Vân Ca Chủ", stats: "9 bài viết • 21.1k điểm" },
                  { name: "Độc Cô Cường Ái", stats: "18 bài viết • 19.8k điểm" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.stats}</div>
                    </div>
                    <button type="button" className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Nội quy diễn đàn */}
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
        </div>
      </main>

      {/* ==================== 3. FOOTER ==================== */}
      <ClientFooter />
    </div>
  );
}

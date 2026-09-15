"use client";

import React from "react";

interface ForumPostContentProps {
  likesCount: number;
  hasLiked: boolean;
  onLike: () => void;
}

export const ForumPostContent: React.FC<ForumPostContentProps> = ({
  likesCount,
  hasLiked,
  onLike,
}) => {
  return (
    <>
      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200 uppercase">KINH NGHIỆM SÁNG TÁC</span>
        <span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md border border-orange-200 uppercase">THIẾT KẾ TIÊN HIỆP</span>
        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">Tiêu điểm</span>
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
              <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">BIÊN TẬP VIÊN</span>
            </div>
            <div className="text-[11px] text-slate-400">Đăng 14:20 • 28/05/2024 • <span className="text-blue-600 font-semibold">4.8k đọc</span></div>
          </div>
        </div>
        <button type="button" className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 flex items-center gap-1.5 text-xs cursor-pointer">
          🔖 Lưu bài viết
        </button>
      </div>

      {/* Article Body */}
      <div className="prose max-w-none text-slate-700 text-sm leading-relaxed space-y-5">
        <p className="first-letter:text-5xl first-letter:font-black first-letter:text-blue-600 first-letter:float-left first-letter:mr-3 first-letter:leading-none">
          Trong suốt 7 năm viết tiểu thuyết Tiên Hiệp và Huyền Huyễn, câu hỏi tôi nhận được nhiều nhất từ các tác giả mới ở StoryVN là: Làm thế nào để thiết kế một hệ thống tu luyện vừa có chiều sâu, mang tính độc đáo mà không bị lặp lại những khuôn sáo cũ, đồng thời nhân vật chính leo rank không làm loãng mạch truyện?
        </p>
        <p>Hôm nay, xin chia sẻ cùng anh em diễn đàn 3 quy tắc then chốt mà tôi đúc kết qua hơn 10 triệu chữ cùng các tác phẩm đạt giải Sáng Tác Vàng tại StoryVN.</p>

        <h2 className="text-lg font-black text-slate-900 pt-2 border-l-4 border-blue-600 pl-3">1. Quy tắc tam giới và phân tầng năng lượng</h2>
        <p>Sai lầm lớn nhất của nhiều tác giả mới là vừa vào truyện đã cho xuất hiện quá nhiều &ldquo;Thần Ma&rdquo;, &ldquo;Chân Thần&rdquo; cùng các tuyệt kỹ huỷ diệt tinh cầu. Khi đó, cảm giác uy lực bị hạ thấp rất nhanh. Hãy bắt đầu từ việc thiết lập phân tầng năng lượng có ranh giới rõ ràng.</p>

        <div className="bg-blue-50/70 border-l-4 border-blue-600 rounded-r-2xl p-4 my-4">
          <p className="italic text-slate-800 font-medium text-xs sm:text-sm">
            &ldquo;Một hệ thống tu chân vững vàng không do đẳng cấp các bạn nghĩ ra, mà do bằng chứng một người tu sĩ trước phải chiến đấu đổi mới nâng cấp cảnh giới!&rdquo;
          </p>
          <div className="text-[11px] font-semibold text-slate-500 mt-1">— Trích từ Sổ tay biên tập viên StoryVN / BTV Lâm Trúc</div>
        </div>

        <h2 className="text-lg font-black text-slate-900 pt-2 border-l-4 border-blue-600 pl-3">2. Thiết lập giới hạn và cái giá của sức mạnh</h2>
        <p>Nếu đột phá cảnh giới mà không phải trả bất kỳ giá nào thì sức mạnh trở nên rẻ rúng. Hãy thiết lập 3 yếu tố cân bằng:</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          {[
            { icon: "🔮", color: "text-blue-800", title: "Tâm Ma Trắc Nghiệm", desc: "Đột phá cảnh giới cao luôn đi kèm với việc thử thách tâm ma, nếu đạo tâm sụp đổ sẽ tẩu hỏa nhập ma." },
            { icon: "⚡", color: "text-purple-800", title: "Lôi Kiếp Tự Nhiên", desc: "Nghịch thiên đoạt huyền cơ bị thiên kiếp nhắm vào, tỷ lệ đan tan ngọc nát cực kỳ cao." },
            { icon: "⏳", color: "text-amber-800", title: "Cái Giá Cảnh Giới", desc: "Nếu không trả giá thỏa đáng tuổi thọ cạn kiệt, vĩnh viễn không thể siêu thoát luân hồi." },
          ].map((item, i) => (
            <div key={i} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
              <div className={`font-black text-xs ${item.color} flex items-center gap-1.5`}>
                <span>{item.icon}</span> {item.title}
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Cultivation Table */}
        <div className="space-y-2 my-6">
          <h3 className="font-black text-sm text-slate-900">Bảng quy chuẩn năng lượng 5 đại cảnh giới cơ bản</h3>
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
                {[
                  { realm: "Luyện Khí (1-9 Tầng)", essence: "Khí ngưng phỏng manh, di chuyển trong kinh mạch", life: "100 - 150 năm", power: "Nhãn quang, ngự vật sơ khai", cost: "Kinh mạch tổn thương nhẹ" },
                  { realm: "Trúc Cơ (Sơ - Hậu)", essence: "Đan điền tích ngưng tụ, xây dựng đạo thai", life: "200 - 350 năm", power: "Ngự kiếm phi hành, chân hỏa xuất phát", cost: "Đan tan phế mạch, tụt về phàm phu" },
                  { realm: "Kim Đan (Cửu Phẩm)", essence: "Cố hóa Kim Đan, ngưng tụ pháp tượng", life: "500 - 800 năm", power: "Đại triệt đại ngộ, điều động nguyên khí", cost: "Kim đan vỡ nát, hồn phi phách tán" },
                  { realm: "Nguyên Anh (Tiên Hóa)", essence: "Thần hồn xuất khiếu, bất tử bất diệt", life: "1,500 - 3,000 năm", power: "Di hình hoán ảnh, đoạt xá trùng sinh", cost: "Nguyên thần tịch diệt bởi Cửu Trọng Lôi" },
                  { realm: "Hóa Thần (Quy Chân)", essence: "Dung hợp Đạo tắc, thiên địa quy nhất", life: "5,000 năm+", power: "Xé rách không gian, tạo lập thế giới", cost: "Hóa đạo (tan biến vào thiên địa)" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-blue-700">{row.realm}</td>
                    <td className="py-2.5 px-3">{row.essence}</td>
                    <td className="py-2.5 px-3 font-mono">{row.life}</td>
                    <td className="py-2.5 px-3">{row.power}</td>
                    <td className="py-2.5 px-3 text-red-600">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tip Box */}
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2 text-xs">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">💡 Mẹo thực chiến cho tác giả StoryVN:</div>
          <ul className="space-y-1.5 text-amber-900/90 pl-4 list-disc">
            <li><b>Quy tắc &ldquo;Tiền vào sau đến trước&rdquo;:</b> Nhân vật chính không cần lúc nào cũng nhặt được bảo vật mạnh nhất; hãy biến thử thách thành cơ hội tôi luyện.</li>
            <li><b>Thông số đừng quá ảo tưởng:</b> Hãy bám sát vào quy luật nội tại của thế giới tu tiên.</li>
            <li><b>Khởi nghiệp tĩnh lặng:</b> Dành ít nhất 20-30 chương đầu để xây dựng bối cảnh và mâu thuẫn giai cấp vững chắc.</li>
          </ul>
        </div>

        {/* Hash tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {["#xaydunghethong", "#kinhnghiemsangtac", "#tienhiep", "#sangtacstoryvn"].map((tag) => (
            <span key={tag} className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer">{tag}</span>
          ))}
        </div>
      </div>

      {/* Like & Share Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLike}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              hasLiked ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
          >
            <span>👍</span>
            <span>Thích • {likesCount}</span>
          </button>
          <button type="button" className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-xs cursor-pointer">
            🔖 Lưu bài viết
          </button>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <span>Chia sẻ:</span>
          <button type="button" className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer">🔗</button>
          <button type="button" className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer">💬</button>
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
              <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">BÚT VÀNG VINH DANH</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-md">
              Tác giả của 3 tác phẩm đạt giải Sáng Tác Vàng tại StoryVN: Tiên Đạo Tranh Phong, Cửu Châu Tiên Mộng...
            </p>
          </div>
        </div>
        <button type="button" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer">
          + Theo dõi tác giả
        </button>
      </div>
    </>
  );
};

"use client";

import React from "react";
import Link from "next/link";

export const ClientFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 pt-12 pb-8 text-slate-600 text-sm">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-100">
          {/* Col 1: Platform Overview (2 Cols Wide) */}
          <div className="lg:col-span-2 space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-900 font-bold text-xl tracking-tight"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <span className="font-extrabold text-lg">S</span>
              </div>
              <span>
                Story<span className="text-blue-600">VN</span>
              </span>
            </Link>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Nền tảng xuất bản trực tuyến và cộng đồng sáng tác tiểu thuyết bản quyền hàng đầu Việt
              Nam. Nơi hội tụ các tác giả tài năng, độc giả đam mê và các tác phẩm kỳ ảo đỉnh cao.
            </p>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-500 text-[16px]">
                  verified_user
                </span>
                <span>Giấy phép cung cấp dịch vụ MXH số: 248/GP-BTTTT cấp bởi Bộ TT&TT</span>
              </p>
            </div>
          </div>

          {/* Col 2: Discover Links */}
          <div>
            <h5 className="text-xs font-bold uppercase text-slate-900 tracking-wider mb-3">
              Khám phá
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link href="/#the-loai" className="hover:text-blue-600 transition-colors">
                  Tiên Hiệp Kỳ Ảo
                </Link>
              </li>
              <li>
                <Link href="/#the-loai" className="hover:text-blue-600 transition-colors">
                  Huyền Huyễn
                </Link>
              </li>
              <li>
                <Link href="/#the-loai" className="hover:text-blue-600 transition-colors">
                  Ngôn Tình & Đô Thị
                </Link>
              </li>
              <li>
                <Link href="/#the-loai" className="hover:text-blue-600 transition-colors">
                  Trùng Sinh Hệ Thống
                </Link>
              </li>
              <li>
                <Link href="/#the-loai" className="hover:text-blue-600 transition-colors">
                  Xuyên Không Giả Tưởng
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Authors */}
          <div>
            <h5 className="text-xs font-bold uppercase text-slate-900 tracking-wider mb-3">
              Dành cho tác giả
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link href="/ho-so" className="hover:text-blue-600 transition-colors">
                  Creator Studio
                </Link>
              </li>
              <li>
                <Link href="#chinh-sach" className="hover:text-blue-600 transition-colors">
                  Chính sách nhuận bút
                </Link>
              </li>
              <li>
                <Link href="#ban-quyen" className="hover:text-blue-600 transition-colors">
                  Bảo vệ bản quyền
                </Link>
              </li>
              <li>
                <Link href="#quy-chuan" className="hover:text-blue-600 transition-colors">
                  Quy chuẩn duyệt truyện
                </Link>
              </li>
              <li>
                <Link href="/dien-dan" className="hover:text-blue-600 transition-colors">
                  Học viện sáng tác
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: App Download & QR */}
          <div>
            <h5 className="text-xs font-bold uppercase text-slate-900 tracking-wider mb-3">
              Tải ứng dụng StoryVN
            </h5>
            <p className="text-xs text-slate-500 mb-3">
              Trải nghiệm đọc mượt mà hơn với chế độ Offline, chế độ nghe Audio và thông báo chương
              mới tức thì.
            </p>
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center font-mono text-[10px] font-bold shadow-2xs">
                <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
              </div>
              <div className="text-[11px] leading-tight text-slate-600">
                <span className="font-bold text-slate-800 block">Quét để tải ứng dụng</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Hỗ trợ iOS & Android</span>
                <span className="text-[10px] text-blue-600 font-semibold">
                  App Store • Google Play
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2024 StoryVN Corporation. Bảo lưu toàn bộ quyền tác giả và nhà phát hành.</p>
          <div className="flex items-center gap-4">
            <Link href="#dieu-khoan" className="hover:text-slate-600 transition-colors">
              Điều khoản dịch vụ
            </Link>
            <Link href="#bao-mat" className="hover:text-slate-600 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="#bao-cao" className="hover:text-slate-600 transition-colors">
              Báo cáo vi phạm bản quyền
            </Link>
            <Link href="#quang-cao" className="hover:text-slate-600 transition-colors">
              Liên hệ quảng cáo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

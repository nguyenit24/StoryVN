"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12 select-none relative overflow-hidden">
      {/* Background subtle radial glow */}
      <div className="absolute w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -top-40 left-1/2 -translate-x-1/2" />

      <div className="relative z-10 flex flex-col items-center max-w-2xl text-center">
        {/* Illustration Container */}
        <div className="relative w-64 h-48 flex items-center justify-center mb-6">
          {/* Faint "404" watermark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[130px] sm:text-[150px] font-extrabold text-blue-100/60 tracking-widest select-none -translate-y-4">
              404
            </span>
          </div>

          {/* Book & Magnifier SVG Graphic */}
          <div className="relative z-10 w-44 h-40 flex items-center justify-center">
            <svg
              viewBox="0 0 160 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-xs"
            >
              {/* Dotted Sheet in top right */}
              <rect
                x="88"
                y="14"
                width="40"
                height="50"
                rx="4"
                fill="#eff6ff"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <line x1="94" y1="26" x2="118" y2="26" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="94" y1="34" x2="122" y2="34" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="94" y1="42" x2="114" y2="42" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />

              {/* Open Book Shadow */}
              <path
                d="M18 108C36 100 70 102 80 114C90 102 124 100 142 108"
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Open Book Pages */}
              <path
                d="M18 42C38 34 70 36 80 48C90 36 122 34 142 42V104C122 96 90 98 80 110C70 98 38 96 18 104V42Z"
                fill="#ffffff"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Center Spine Crease */}
              <line x1="80" y1="48" x2="80" y2="110" stroke="#94a3b8" strokeWidth="2" />

              {/* Blue Bookmark Ribbon */}
              <path
                d="M79 48V78L83 74L87 78V48"
                fill="#2563eb"
              />

              {/* Magnifying Glass on Left Page */}
              <circle
                cx="52"
                cy="70"
                r="15"
                fill="#ffffff"
                stroke="#2563eb"
                strokeWidth="2.5"
              />
              <line
                x1="63"
                y1="81"
                x2="73"
                y2="91"
                stroke="#2563eb"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Question mark in magnifier */}
              <text
                x="52"
                y="75"
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#2563eb"
                fontFamily="sans-serif"
              >
                ?
              </text>
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Chương truyện hoặc trang này không tồn tại
        </h1>

        {/* Description */}
        <p className="mt-3.5 text-slate-500 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
          Trang bạn đang tìm kiếm có thể đã được tác giả gỡ bỏ, đổi tên chương hoặc liên kết bị gián đoạn. Đừng lo lắng, các tác phẩm hấp dẫn khác vẫn đang chờ bạn!
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* Button 1: Về trang chủ */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm shadow-blue-500/20 active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>Về trang chủ</span>
          </Link>

          {/* Button 2: Mở Tủ sách cá nhân */}
          <Link
            href="/me"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm shadow-2xs hover:border-slate-300 active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            <span>Mở Tủ sách cá nhân</span>
          </Link>

          {/* Button 3: Quay lại trang trước */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm shadow-2xs hover:border-slate-300 active:scale-98 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Quay lại trang trước</span>
          </button>
        </div>
      </div>
    </div>
  );
}

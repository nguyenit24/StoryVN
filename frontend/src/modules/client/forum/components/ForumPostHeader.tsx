"use client";

import React from "react";
import Link from "next/link";

export const ForumPostHeader: React.FC = () => {
  return (
    <>
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
        <span>/</span>
        <Link href="/dien-dan" className="hover:text-blue-600">Diễn đàn</Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">Kinh nghiệm sáng tác</span>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-xs">
          Làm sao để xây dựng hệ thống tu luyện logic mà không bị loãng mạch truyện?
        </span>
      </nav>
    </>
  );
};

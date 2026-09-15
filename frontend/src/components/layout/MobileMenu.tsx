"use client";

import React from "react";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  searchQuery: string;
  isHomeActive: boolean;
  isForumActive: boolean;
  isAdminOrManager: boolean;
  onSearchChange: (v: string) => void;
  onSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  searchQuery,
  isHomeActive,
  isForumActive,
  isAdminOrManager,
  onSearchChange,
  onSearchSubmit,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-5 space-y-3 shadow-lg animate-fadeIn">
      {/* Mobile Search */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <span className="material-symbols-outlined text-[18px]">search</span>
        </div>
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={onSearchSubmit}
          className="w-full pl-9 pr-4 py-2 bg-slate-100 text-sm rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400 outline-none"
          placeholder="Tìm kiếm truyện, tác giả..."
          type="text"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
        <Link
          href="/"
          onClick={onClose}
          className={`px-3 py-2 rounded-lg hover:bg-slate-50 ${isHomeActive ? "text-blue-600 font-semibold" : ""}`}
        >
          Khám phá
        </Link>
        <Link href="/#the-loai" onClick={onClose} className="px-3 py-2 rounded-lg hover:bg-slate-50">
          Thể loại
        </Link>
        <Link href="/#bang-xep-hang" onClick={onClose} className="px-3 py-2 rounded-lg hover:bg-slate-50">
          Bảng xếp hạng
        </Link>
        <Link
          href="/dien-dan"
          onClick={onClose}
          className={`px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between ${isForumActive ? "text-blue-600 font-semibold" : ""}`}
        >
          <span>Diễn đàn</span>
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
        </Link>

        {isAdminOrManager && (
          <Link
            href="/admin"
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>Admin Quản Trị Hệ Thống</span>
          </Link>
        )}

        <Link
          href="/ho-so"
          onClick={onClose}
          className="sm:hidden px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold flex items-center gap-1.5 mt-2"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Viết truyện</span>
        </Link>
      </div>
    </div>
  );
};

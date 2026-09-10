"use client";

import React, { useState } from "react";
import { CategoryItem } from "../models/category.model";
import ModalPortal from "@/common/components/ModalPortal";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryItem | null;
  onSubmit: (data: { name: string; description?: string }) => Promise<void>;
  isLoading: boolean;
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  category,
  onSubmit,
  isLoading,
}: CategoryFormModalProps) {
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Vui lòng nhập tên thể loại");
      return;
    }
    if (trimmed.length < 2) {
      setError("Tên thể loại phải có ít nhất 2 ký tự");
      return;
    }
    if (trimmed.length > 100) {
      setError("Tên thể loại không được vượt quá 100 ký tự");
      return;
    }

    try {
      await onSubmit({
        name: trimmed,
        description: description.trim() || undefined,
      });
    } catch {
      // Error handled in hook toast
    }
  };

  const isEditing = Boolean(category);

  return (
    <ModalPortal isOpen={isOpen} onClose={isLoading ? undefined : onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-modalPop relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">
                {isEditing ? "edit" : "category"}
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {isEditing ? "Chỉnh sửa thể loại" : "Thêm thể loại mới"}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? "Cập nhật thông tin thể loại truyện"
                  : "Tạo thể loại truyện mới cho hệ thống"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tên thể loại <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="VD: Tiên Hiệp, Huyền Huyễn..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mô tả chi tiết
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Giới thiệu sơ lược đặc điểm thể loại..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Auto Slug Notice */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100/60 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-blue-600 text-[18px] shrink-0 mt-0.5">
              info
            </span>
            <p className="text-[12px] text-blue-800 leading-relaxed">
              <strong>Slug tự động:</strong> Slug định danh sẽ được tự động sinh và cập nhật chuẩn hóa theo tên thể loại (không cần nhập thủ công).
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>{isEditing ? "Lưu thay đổi" : "Tạo thể loại"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}

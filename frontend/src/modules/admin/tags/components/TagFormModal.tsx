"use client";

import React, { useState } from "react";
import { TagItem } from "../models/tag.model";
import ModalPortal from "@/common/components/ModalPortal";

interface TagFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag: TagItem | null;
  onSubmit: (data: { name: string; description?: string }) => Promise<void>;
  isLoading: boolean;
}

export default function TagFormModal({
  isOpen,
  onClose,
  tag,
  onSubmit,
  isLoading,
}: TagFormModalProps) {
  const [name, setName] = useState(tag?.name || "");
  const [description, setDescription] = useState(tag?.description || "");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Vui lòng nhập tên thẻ");
      return;
    }
    if (trimmed.length < 2) {
      setError("Tên thẻ phải có ít nhất 2 ký tự");
      return;
    }
    if (trimmed.length > 50) {
      setError("Tên thẻ không được vượt quá 50 ký tự");
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

  const isEditing = Boolean(tag);

  return (
    <ModalPortal isOpen={isOpen} onClose={isLoading ? undefined : onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-modalPop relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">
                {isEditing ? "edit" : "label"}
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {isEditing ? "Chỉnh sửa thẻ tag" : "Thêm thẻ tag mới"}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? "Cập nhật nhãn phân loại từ khóa truyện"
                  : "Tạo nhãn từ khóa mới cho các tác phẩm"}
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
              Tên thẻ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="VD: Hệ Thống, Xuyên Không, Trọng Sinh..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
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
              placeholder="Giải thích ngắn gọn ý nghĩa của nhãn tag..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Auto Slug Notice */}
          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100/60 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-indigo-600 text-[18px] shrink-0 mt-0.5">
              info
            </span>
            <p className="text-[12px] text-indigo-800 leading-relaxed">
              <strong>Slug tự động:</strong> Slug định danh sẽ được tự động tạo và cập nhật chuẩn hóa theo tên thẻ (không cần nhập thủ công).
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
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>{isEditing ? "Lưu thay đổi" : "Tạo thẻ tag"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}

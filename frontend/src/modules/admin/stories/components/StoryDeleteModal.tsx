"use client";

import React from "react";
import { AdminStoryItem, StoryAuthor } from "../models/story.model";
import ModalPortal from "@/common/components/ModalPortal";

interface StoryDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: AdminStoryItem | null;
  onConfirm: (id: string) => Promise<unknown>;
  isLoading: boolean;
}

export default function StoryDeleteModal({
  isOpen,
  onClose,
  story,
  onConfirm,
  isLoading,
}: StoryDeleteModalProps) {
  if (!isOpen || !story) return null;

  const author = typeof story.authorId === "object" ? (story.authorId as StoryAuthor) : null;
  const authorName = author?.displayName || author?.username || "Chưa xác định";

  const handleDelete = async () => {
    try {
      await onConfirm(story._id);
    } catch {
      // Error handled in hook toast
    }
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={isLoading ? undefined : onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-modalPop relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-red-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">delete_forever</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Xóa tác phẩm (Quản trị)
              </h3>
              <p className="text-xs text-slate-500">
                Xử lý vi phạm và gỡ bỏ tác phẩm khỏi hệ thống
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Bạn có chắc chắn muốn xóa tác phẩm{" "}
            <strong className="text-slate-900 font-semibold underline decoration-red-300">
              {story.title}
            </strong>{" "}
            của tác giả <strong>{authorName}</strong>?
          </p>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p><strong>Mã ID:</strong> <code className="font-mono text-slate-800">{story._id}</code></p>
            <p><strong>Slug:</strong> <code className="font-mono text-slate-800">{story.slug}</code></p>
            <p><strong>Trạng thái:</strong> <span className="font-semibold">{story.status}</span> ({story.isVip ? "VIP" : "Thường"})</p>
          </div>

          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/60 flex items-start gap-3">
            <span className="material-symbols-outlined text-red-600 text-[20px] shrink-0 mt-0.5">
              warning
            </span>
            <p className="text-xs text-red-800 leading-relaxed">
              <strong>Cảnh báo quản trị:</strong> Toàn bộ dữ liệu của tác phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống. Hãy kiểm tra kỹ trước khi xác nhận.
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
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:scale-98 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xóa...</span>
                </>
              ) : (
                <span>Xác nhận xóa tác phẩm</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

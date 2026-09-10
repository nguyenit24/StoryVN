"use client";

import React from "react";
import { CategoryItem } from "../models/category.model";
import ModalPortal from "@/common/components/ModalPortal";

interface CategoryDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryItem | null;
  onConfirm: (id: string) => Promise<unknown>;
  isLoading: boolean;
}

export default function CategoryDeleteModal({
  isOpen,
  onClose,
  category,
  onConfirm,
  isLoading,
}: CategoryDeleteModalProps) {
  if (!isOpen || !category) return null;

  const handleDelete = async () => {
    try {
      await onConfirm(category._id);
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
              <span className="material-symbols-outlined text-[22px]">delete</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Xác nhận xóa thể loại
              </h3>
              <p className="text-xs text-slate-500">
                Hành động này không thể hoàn tác
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
            Bạn có chắc chắn muốn xóa thể loại{" "}
            <strong className="text-slate-900 font-semibold underline decoration-red-300">
              {category.name}
            </strong>{" "}
            (slug: <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{category.slug}</code>)?
          </p>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/60 flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-600 text-[20px] shrink-0 mt-0.5">
              warning
            </span>
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Ràng buộc hệ thống:</strong> Nếu thể loại này đang được gán vào bất kỳ tác phẩm nào, yêu cầu xóa sẽ bị hệ thống từ chối để đảm bảo tính toàn vẹn dữ liệu.
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
                <span>Xóa thể loại</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

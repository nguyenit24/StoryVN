"use client";

import React from "react";
import { CategoryItem } from "../models/category.model";

interface CategoriesTableProps {
  categories: CategoryItem[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (category: CategoryItem) => void;
  onDelete: (category: CategoryItem) => void;
}

export default function CategoriesTable({
  categories,
  isLoading,
  currentPage,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="space-y-2 flex-1 max-w-md">
                <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                <div className="h-3 bg-slate-100 rounded-md w-2/3" />
              </div>
              <div className="h-6 bg-slate-200 rounded-lg w-20" />
              <div className="h-8 bg-slate-100 rounded-lg w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[32px]">category</span>
        </div>
        <h3 className="text-base font-bold text-slate-700">Chưa có thể loại nào</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Không tìm thấy dữ liệu thể loại phù hợp với điều kiện tìm kiếm hiện tại.
        </p>
      </div>
    );
  }

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(total, currentPage * pageSize);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-4 w-14 text-center">STT</th>
              <th className="py-3.5 px-5">Tên thể loại</th>
              <th className="py-3.5 px-4">Slug định danh</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Mô tả</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Ngày tạo</th>
              <th className="py-3.5 px-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((category, index) => {
              const stt = (currentPage - 1) * pageSize + index + 1;

              return (
                <tr
                  key={category._id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  {/* STT */}
                  <td className="py-4 px-4 text-center font-mono text-xs text-slate-400 font-semibold">
                    {stt}
                  </td>

                  {/* Name */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {category.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </span>
                        <p className="text-xs text-slate-400 md:hidden mt-0.5 line-clamp-1">
                          {category.description || "Không có mô tả"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                      {category.slug}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-4 px-4 hidden md:table-cell max-w-xs">
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {category.description || (
                        <span className="text-slate-400 italic">Chưa có mô tả</span>
                      )}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 hidden sm:table-cell text-xs text-slate-500 whitespace-nowrap">
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(category)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <span className="material-symbols-outlined text-[19px]">edit</span>
                      </button>
                      <button
                        onClick={() => onDelete(category)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa"
                      >
                        <span className="material-symbols-outlined text-[19px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span>
            Hiển thị <strong>{startRecord}</strong> - <strong>{endRecord}</strong> trong tổng số <strong>{total}</strong> thể loại
          </span>

          {/* Page size selector: 10, 20, 50 */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="text-slate-400">Số bản ghi:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Trang trước"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - currentPage) <= 1
              )
              .map((p, idx, arr) => (
                <React.Fragment key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1 text-slate-400">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(p)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === p
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Trang sau"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

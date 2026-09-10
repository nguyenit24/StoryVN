/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { AdminStoryItem, StoryAuthor } from "../models/story.model";
import { getFullImageUrl } from "@/common/utils/imageUrl";

interface StoriesTableProps {
  stories: AdminStoryItem[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewDetail: (story: AdminStoryItem) => void;
  onDelete: (story: AdminStoryItem) => void;
}

export default function StoriesTable({
  stories,
  isLoading,
  currentPage,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
  onDelete,
}: StoriesTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
            >
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="w-12 h-16 bg-slate-200 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded-md w-2/3" />
                  <div className="h-3 bg-slate-100 rounded-md w-1/3" />
                </div>
              </div>
              <div className="h-6 bg-slate-200 rounded-lg w-20" />
              <div className="h-6 bg-slate-100 rounded-lg w-16" />
              <div className="h-8 bg-slate-100 rounded-lg w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[32px]">auto_stories</span>
        </div>
        <h3 className="text-base font-bold text-slate-700">Không tìm thấy tác phẩm nào</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Không có tác phẩm nào phù hợp với điều kiện tìm kiếm hoặc bộ lọc hiện tại.
        </p>
      </div>
    );
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "ONGOING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Đang ra
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hoàn thành
          </span>
        );
      case "PAUSED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Tạm dừng
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Bản nháp
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-4 w-14 text-center">STT</th>
              <th className="py-3.5 px-5">Tác phẩm</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Tác giả</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Thể loại &amp; Tag</th>
              <th className="py-3.5 px-4">Trạng thái</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Phân loại</th>
              <th className="py-3.5 px-4 hidden xl:table-cell">Cập nhật</th>
              <th className="py-3.5 px-5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stories.map((story, index) => {
              const stt = (currentPage - 1) * pageSize + index + 1;
              const author =
                typeof story.authorId === "object"
                  ? (story.authorId as StoryAuthor)
                  : null;
              const authorName =
                author?.displayName || author?.username || "Không xác định";

              return (
                <tr
                  key={story._id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  {/* STT */}
                  <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-400 font-semibold">
                    {stt}
                  </td>

                  {/* Story Title & Cover */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-15 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs flex items-center justify-center">
                        {story.coverUrl ? (
                          <img
                            src={getFullImageUrl(story.coverUrl)}
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-slate-300 text-[22px]">
                            image
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <button
                          onClick={() => onViewDetail(story)}
                          className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 text-left block"
                        >
                          {story.title}
                        </button>
                        <span className="inline-block text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                          {story.slug}
                        </span>
                        <div className="sm:hidden text-xs text-slate-500 mt-0.5">
                          Tác giả: <span className="font-medium">{authorName}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Author */}
                  <td className="py-3.5 px-4 hidden sm:table-cell whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0 overflow-hidden">
                        {author?.avatar ? (
                          <img
                            src={getFullImageUrl(author.avatar)}
                            alt={authorName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          authorName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-700 truncate max-w-[140px]">
                        {authorName}
                      </span>
                    </div>
                  </td>

                  {/* Categories & Tags */}
                  <td className="py-3.5 px-4 hidden lg:table-cell max-w-[220px]">
                    <div className="flex flex-wrap gap-1">
                      {story.categoryIds && story.categoryIds.length > 0 ? (
                        story.categoryIds.slice(0, 2).map((c) => (
                          <span
                            key={c._id}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100"
                          >
                            {c.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">Không có</span>
                      )}
                      {story.categoryIds && story.categoryIds.length > 2 && (
                        <span className="text-[10px] text-slate-400 font-medium self-center">
                          +{story.categoryIds.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {renderStatusBadge(story.status)}
                  </td>

                  {/* VIP */}
                  <td className="py-3.5 px-4 hidden md:table-cell whitespace-nowrap">
                    {story.isVip ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <span className="material-symbols-outlined text-[13px]">star</span>
                        VIP
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                        Thường
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 hidden xl:table-cell text-xs text-slate-500 whitespace-nowrap">
                    {story.updatedAt
                      ? new Date(story.updatedAt).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewDetail(story)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Xem chi tiết"
                      >
                        <span className="material-symbols-outlined text-[19px]">visibility</span>
                      </button>
                      <button
                        onClick={() => onDelete(story)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa tác phẩm (Quản trị/Vi phạm)"
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
            Hiển thị{" "}
            <strong>{total > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> -{" "}
            <strong>{Math.min(total, currentPage * pageSize)}</strong> trong tổng số{" "}
            <strong>{total}</strong> tác phẩm
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

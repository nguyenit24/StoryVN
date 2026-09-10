/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { AdminStoryItem, StoryAuthor } from "../models/story.model";
import { getFullImageUrl } from "@/common/utils/imageUrl";
import ModalPortal from "@/common/components/ModalPortal";

interface StoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: AdminStoryItem | null;
}

export default function StoryDetailModal({
  isOpen,
  onClose,
  story,
}: StoryDetailModalProps) {
  if (!isOpen || !story) return null;

  const author = typeof story.authorId === "object" ? (story.authorId as StoryAuthor) : null;
  const authorName = author?.displayName || author?.username || "Không xác định";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ONGOING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Đang ra (ONGOING)
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hoàn thành (COMPLETED)
          </span>
        );
      case "PAUSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Tạm dừng (PAUSED)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Bản nháp (DRAFT)
          </span>
        );
    }
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-modalPop max-h-[90vh] flex flex-col relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">menu_book</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Chi tiết tác phẩm
              </h3>
              <p className="text-xs text-slate-500">
                Thông tin hồ sơ và cấu hình xuất bản tác phẩm
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Main Info Box */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Cover */}
            <div className="w-28 h-38 sm:w-32 sm:h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs flex items-center justify-center">
              {story.coverUrl ? (
                <img
                  src={getFullImageUrl(story.coverUrl)}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-400 text-center p-2">
                  <span className="material-symbols-outlined text-[36px]">image</span>
                  <p className="text-[10px] mt-1 font-medium">Chưa có bìa</p>
                </div>
              )}
            </div>

            {/* Title & Meta */}
            <div className="flex-1 space-y-2.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(story.status)}
                {story.isVip ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300/60">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    TRUYỆN VIP
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                    Truyện Thường
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {story.title}
              </h2>

              <p className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/60 inline-block">
                slug: {story.slug}
              </p>

              {/* Author */}
              <div className="pt-2 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
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
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Tác giả: {authorName}
                  </p>
                  {author?.email && (
                    <p className="text-[11px] text-slate-400">{author.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Thể loại ({story.categoryIds?.length || 0})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {story.categoryIds && story.categoryIds.length > 0 ? (
                  story.categoryIds.map((c) => (
                    <span
                      key={c._id}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100/70 text-blue-800 border border-blue-200/50"
                    >
                      {c.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">Chưa gắn thể loại</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Thẻ tag ({story.tagIds?.length || 0})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {story.tagIds && story.tagIds.length > 0 ? (
                  story.tagIds.map((t) => (
                    <span
                      key={t._id}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-100/70 text-indigo-800 border border-indigo-200/50"
                    >
                      #{t.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">Chưa gắn thẻ tag</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Tóm tắt tác phẩm
            </h4>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
              {story.description || (
                <span className="text-slate-400 italic">Chưa có tóm tắt mô tả nội dung.</span>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
            <span>
              Ngày tạo: {story.createdAt ? new Date(story.createdAt).toLocaleString("vi-VN") : "-"}
            </span>
            <span>
              Cập nhật: {story.updatedAt ? new Date(story.updatedAt).toLocaleString("vi-VN") : "-"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}

"use client";

import React from "react";
import { useAdminStories } from "../hooks/useAdminStories";
import StoryFilterBar from "./StoryFilterBar";
import StoriesTable from "./StoriesTable";
import StoryDetailModal from "./StoryDetailModal";
import StoryDeleteModal from "./StoryDeleteModal";

export default function AdminStoriesPage() {
  const {
    stories,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    vipFilter,
    setVipFilter,
    selectedStory,
    isDetailModalOpen,
    storyToDelete,
    isDeleteModalOpen,
    openDetailModal,
    closeDetailModal,
    openDeleteModal,
    closeDeleteModal,
    deleteStory,
    isDeleting,
  } = useAdminStories();

  return (
    <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 animate-fadeIn">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              Quản trị nội dung
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-medium text-slate-500">
              Phân hệ Kho tác phẩm
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Tác phẩm (Truyện)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Theo dõi, kiểm duyệt xuất bản và xử lý vi phạm nội dung truyện trên toàn hệ thống
          </p>
        </div>
      </div>

      {/* 2. Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">auto_stories</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Tổng tác phẩm</p>
            <p className="text-xl font-extrabold text-slate-900">{total}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Hội viên VIP</p>
            <p className="text-xl font-extrabold text-slate-900">
              {stories.filter((s) => s.isVip).length} <span className="text-xs font-normal text-slate-400">(trang này)</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">trending_up</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Đang phát hành</p>
            <p className="text-xl font-extrabold text-slate-900">
              {stories.filter((s) => s.status === "ONGOING").length} <span className="text-xs font-normal text-slate-400">(trang này)</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">task_alt</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Đã hoàn thành</p>
            <p className="text-xl font-extrabold text-slate-900">
              {stories.filter((s) => s.status === "COMPLETED").length} <span className="text-xs font-normal text-slate-400">(trang này)</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <StoryFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        vipFilter={vipFilter}
        onVipFilterChange={setVipFilter}
        totalResults={total}
      />

      {/* 4. Data Table */}
      <StoriesTable
        stories={stories}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onViewDetail={openDetailModal}
        onDelete={openDeleteModal}
      />

      {/* 5. Modals */}
      <StoryDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        story={selectedStory}
      />

      <StoryDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        story={storyToDelete}
        onConfirm={deleteStory}
        isLoading={isDeleting}
      />
    </main>
  );
}

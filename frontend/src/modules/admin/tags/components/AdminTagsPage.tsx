"use client";

import React from "react";
import { useAdminTags } from "../hooks/useAdminTags";
import TagsTable from "./TagsTable";
import TagFormModal from "./TagFormModal";
import TagDeleteModal from "./TagDeleteModal";

export default function AdminTagsPage() {
  const {
    tags,
    rawTags,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    isLoading,
    searchQuery,
    setSearchQuery,
    isFormModalOpen,
    isDeleteModalOpen,
    selectedTag,
    tagToDelete,
    openCreateModal,
    openEditModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
    createTag,
    isCreating,
    updateTag,
    isUpdating,
    deleteTag,
    isDeleting,
    seedTags,
    isSeeding,
  } = useAdminTags();

  const handleFormSubmit = async (data: { name: string; description?: string }) => {
    if (selectedTag) {
      await updateTag({ id: selectedTag._id, data });
    } else {
      await createTag(data);
    }
  };

  const totalCount = total;
  const withDescCount = tags.filter((t) => Boolean(t.description?.trim())).length;

  return (
    <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 animate-fadeIn">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Quản trị nội dung
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-medium text-slate-500">
              Phân hệ Từ khóa &amp; Nhãn tag
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Thẻ (Tag)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Quản lý các nhãn chủ đề và từ khóa đặc trưng giúp phân loại và tìm kiếm tác phẩm
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={() => seedTags()}
            disabled={isSeeding}
            className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 hover:bg-indigo-100/70 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs flex items-center gap-1.5"
            title="Tự động tạo danh sách 45 thẻ tag truyện phổ biến nhất chuẩn tiếng Việt"
          >
            <span className={`material-symbols-outlined text-[20px] text-indigo-600 ${isSeeding ? "animate-spin" : ""}`}>
              {isSeeding ? "progress_activity" : "auto_awesome"}
            </span>
            <span>{isSeeding ? "Đang tạo mẫu..." : "Khởi tạo dữ liệu mẫu"}</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Thêm thẻ tag mới</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[26px]">label</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Tổng số thẻ</p>
            <p className="text-2xl font-extrabold text-slate-900">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[26px]">description</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Có mô tả ý nghĩa</p>
            <p className="text-2xl font-extrabold text-slate-900">{withDescCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[26px]">auto_awesome</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Slug định danh</p>
            <p className="text-sm font-bold text-slate-700">Tự động chuẩn hóa</p>
          </div>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm thẻ tag, slug..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium self-end sm:self-center">
          Tìm thấy <strong>{total}</strong> thẻ tag
        </span>
      </div>

      {/* 4. Table */}
      <TagsTable
        tags={tags}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      {/* 5. Modals */}
      {isFormModalOpen && (
        <TagFormModal
          key={selectedTag?._id || "new"}
          isOpen={isFormModalOpen}
          onClose={closeFormModal}
          tag={selectedTag}
          onSubmit={handleFormSubmit}
          isLoading={isCreating || isUpdating}
        />
      )}

      <TagDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        tag={tagToDelete}
        onConfirm={deleteTag}
        isLoading={isDeleting}
      />
    </main>
  );
}

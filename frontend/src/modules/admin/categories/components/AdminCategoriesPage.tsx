"use client";

import React from "react";
import { useAdminCategories } from "../hooks/useAdminCategories";
import CategoriesTable from "./CategoriesTable";
import CategoryFormModal from "./CategoryFormModal";
import CategoryDeleteModal from "./CategoryDeleteModal";

export default function AdminCategoriesPage() {
  const {
    categories,
    rawCategories,
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
    selectedCategory,
    categoryToDelete,
    openCreateModal,
    openEditModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
    createCategory,
    isCreating,
    updateCategory,
    isUpdating,
    deleteCategory,
    isDeleting,
    seedCategories,
    isSeeding,
  } = useAdminCategories();

  const handleFormSubmit = async (data: { name: string; description?: string }) => {
    if (selectedCategory) {
      await updateCategory({ id: selectedCategory._id, data });
    } else {
      await createCategory(data);
    }
  };

  const totalCount = total;
  const withDescCount = categories.filter((c) => Boolean(c.description?.trim())).length;

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
              Phân loại tác phẩm
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Thể loại truyện
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Thiết lập danh mục thể loại cho các tác giả gắn nhãn tác phẩm trong hệ thống
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            onClick={() => seedCategories()}
            disabled={isSeeding}
            className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 hover:bg-blue-100/70 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs flex items-center gap-1.5"
            title="Tự động tạo danh sách 30 thể loại truyện phổ biến nhất chuẩn tiếng Việt"
          >
            <span className={`material-symbols-outlined text-[20px] text-blue-600 ${isSeeding ? "animate-spin" : ""}`}>
              {isSeeding ? "progress_activity" : "auto_awesome"}
            </span>
            <span>{isSeeding ? "Đang tạo mẫu..." : "Khởi tạo dữ liệu mẫu"}</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Thêm thể loại mới</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[26px]">category</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Tổng thể loại</p>
            <p className="text-2xl font-extrabold text-slate-900">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[26px]">description</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Có mô tả chi tiết</p>
            <p className="text-2xl font-extrabold text-slate-900">{withDescCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[26px]">auto_awesome</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Định danh SEO</p>
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
            placeholder="Tìm kiếm thể loại, slug..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium self-end sm:self-center">
          Tìm thấy <strong>{total}</strong> kết quả
        </span>
      </div>

      {/* 4. Table */}
      <CategoriesTable
        categories={categories}
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
        <CategoryFormModal
          key={selectedCategory?._id || "new"}
          isOpen={isFormModalOpen}
          onClose={closeFormModal}
          category={selectedCategory}
          onSubmit={handleFormSubmit}
          isLoading={isCreating || isUpdating}
        />
      )}

      <CategoryDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        category={categoryToDelete}
        onConfirm={deleteCategory}
        isLoading={isDeleting}
      />
    </main>
  );
}

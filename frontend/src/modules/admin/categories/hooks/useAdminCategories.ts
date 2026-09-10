import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AdminCategoryService } from "../services/category.service";
import {
  CategoryItem,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../models/category.model";

export const useAdminCategories = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

  // 1. Fetch danh sách thể loại từ Backend (Server-side pagination & search)
  const categoriesQuery = useQuery({
    queryKey: ["admin-categories", { page: currentPage, limit: pageSize, search: searchQuery }],
    queryFn: async () => {
      return await AdminCategoryService.getAll({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
      });
    },
    staleTime: 1000 * 60 * 2,
  });

  const categories = useMemo(
    () => categoriesQuery.data?.data || [],
    [categoriesQuery.data?.data]
  );
  const total = categoriesQuery.data?.meta?.total || 0;
  const totalPages = categoriesQuery.data?.meta?.totalPages || 1;

  // Tự động về trang 1 khi tìm kiếm hoặc đổi số bản ghi/trang
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  // 4. Mutation Tạo mới
  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryInput) => AdminCategoryService.create(data),
    onSuccess: () => {
      toast.success("Thêm thể loại mới thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      closeFormModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Lỗi khi tạo thể loại";
      toast.error(msg);
    },
  });

  // 5. Mutation Cập nhật
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) =>
      AdminCategoryService.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thể loại thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      closeFormModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Lỗi khi cập nhật thể loại";
      toast.error(msg);
    },
  });

  // 6. Mutation Xóa
  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminCategoryService.delete(id),
    onSuccess: () => {
      toast.success("Xóa thể loại thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      closeDeleteModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Lỗi khi xóa thể loại";
      toast.error(msg);
    },
  });

  // 7. Mutation Khởi tạo dữ liệu mẫu (Seed Data)
  const seedMutation = useMutation({
    mutationFn: () => AdminCategoryService.seed(),
    onSuccess: (res) => {
      toast.success(res.message || "Khởi tạo dữ liệu mẫu thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Lỗi khi khởi tạo thể loại mẫu";
      toast.error(msg);
    },
  });

  // Modal helpers
  const openCreateModal = () => {
    setSelectedCategory(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (category: CategoryItem) => {
    setSelectedCategory(category);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedCategory(null);
  };

  const openDeleteModal = (category: CategoryItem) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  return {
    categories,
    rawCategories: categories,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
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
    createCategory: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCategory: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCategory: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    seedCategories: seedMutation.mutateAsync,
    isSeeding: seedMutation.isPending,
    refetch: categoriesQuery.refetch,
  };
};

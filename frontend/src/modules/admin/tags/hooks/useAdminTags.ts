import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AdminTagService } from "../services/tag.service";
import {
  TagItem,
  CreateTagInput,
  UpdateTagInput,
} from "../models/tag.model";

export const useAdminTags = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTag, setSelectedTag] = useState<TagItem | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<TagItem | null>(null);

  // 1. Fetch danh sách thẻ tag từ Backend (Server-side pagination & search)
  const tagsQuery = useQuery({
    queryKey: ["admin-tags", { page: currentPage, limit: pageSize, search: searchQuery }],
    queryFn: async () => {
      return await AdminTagService.getAll({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
      });
    },
    staleTime: 1000 * 60 * 2,
  });

  const tags = useMemo(
    () => tagsQuery.data?.data || [],
    [tagsQuery.data?.data]
  );
  const total = tagsQuery.data?.meta?.total || 0;
  const totalPages = tagsQuery.data?.meta?.totalPages || 1;

  // Tự động về trang 1 khi tìm kiếm hoặc đổi số bản ghi/trang
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  // 4. Mutation Tạo mới
  const createMutation = useMutation({
    mutationFn: (data: CreateTagInput) => AdminTagService.create(data),
    onSuccess: () => {
      toast.success("Thêm thẻ tag mới thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      closeFormModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Lỗi khi tạo thẻ tag";
      toast.error(msg);
    },
  });

  // 5. Mutation Cập nhật
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTagInput }) =>
      AdminTagService.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật thẻ tag thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      closeFormModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Lỗi khi cập nhật thẻ tag";
      toast.error(msg);
    },
  });

  // 6. Mutation Xóa
  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminTagService.delete(id),
    onSuccess: () => {
      toast.success("Xóa thẻ tag thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      closeDeleteModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Lỗi khi xóa thẻ tag";
      toast.error(msg);
    },
  });

  // 7. Mutation Khởi tạo dữ liệu mẫu (Seed Data)
  const seedMutation = useMutation({
    mutationFn: () => AdminTagService.seed(),
    onSuccess: (res) => {
      toast.success(res.message || "Khởi tạo dữ liệu thẻ tag mẫu thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Lỗi khi khởi tạo thẻ tag mẫu";
      toast.error(msg);
    },
  });

  // Modal helpers
  const openCreateModal = () => {
    setSelectedTag(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (tag: TagItem) => {
    setSelectedTag(tag);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedTag(null);
  };

  const openDeleteModal = (tag: TagItem) => {
    setTagToDelete(tag);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTagToDelete(null);
  };

  return {
    tags,
    rawTags: tags,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    isLoading: tagsQuery.isLoading,
    isError: tagsQuery.isError,
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
    createTag: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTag: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTag: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    seedTags: seedMutation.mutateAsync,
    isSeeding: seedMutation.isPending,
    refetch: tagsQuery.refetch,
  };
};

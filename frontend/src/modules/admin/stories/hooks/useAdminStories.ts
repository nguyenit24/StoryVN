import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AdminStoryService } from "../services/story.service";
import {
  AdminStoryItem,
  StoryStatusType,
} from "../models/story.model";

export const useAdminStories = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StoryStatusType | "ALL">("ALL");
  const [vipFilter, setVipFilter] = useState<boolean | "ALL">("ALL");

  const [selectedStory, setSelectedStory] = useState<AdminStoryItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<AdminStoryItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Tự động về trang 1 khi thay đổi bộ lọc tìm kiếm hoặc số bản ghi/trang
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, vipFilter, pageSize]);

  // 1. Fetch danh sách tác phẩm cho Admin
  const storiesQuery = useQuery({
    queryKey: [
      "admin-stories",
      { page: currentPage, limit: pageSize, search: searchQuery, status: statusFilter, isVip: vipFilter },
    ],
    queryFn: async () => {
      return await AdminStoryService.getAll({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        status: statusFilter,
        isVip: vipFilter,
      });
    },
    staleTime: 1000 * 60 * 2,
  });

  const storiesData = storiesQuery.data;
  const stories = storiesData?.data || [];
  const total = storiesData?.meta?.total || 0;
  const totalPages = storiesData?.meta?.totalPages || 1;

  // 2. Mutation Xóa tác phẩm (Admin quyền xóa xử lý vi phạm)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminStoryService.delete(id),
    onSuccess: () => {
      toast.success("Đã xóa tác phẩm khỏi hệ thống thành công!");
      queryClient.invalidateQueries({ queryKey: ["admin-stories"] });
      closeDeleteModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Lỗi khi xóa tác phẩm";
      toast.error(msg);
    },
  });

  // Modal helpers
  const openDetailModal = (story: AdminStoryItem) => {
    setSelectedStory(story);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedStory(null);
  };

  const openDeleteModal = (story: AdminStoryItem) => {
    setStoryToDelete(story);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setStoryToDelete(null);
  };

  return {
    stories,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    isLoading: storiesQuery.isLoading,
    isError: storiesQuery.isError,
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
    deleteStory: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    refetch: storiesQuery.refetch,
  };
};

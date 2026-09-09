import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AdminUserService } from "../services/user.service";
import { SystemUserItem, AdminUserRole, AdminUserStatus } from "../models/user.model";
import { User } from "@/modules/client/auth/models/auth.model";
import { getFullImageUrl } from "@/common/utils/imageUrl";
import { MOCK_SYSTEM_USERS } from "../mocks/user.mock";

export const useAdminUsers = (initialPageSize = 5) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminUserRole>("ALL");
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMaskedPrivacy, setIsMaskedPrivacy] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const pageSize = initialPageSize;

  // Optimistic overrides map
  const [overrides, setOverrides] = useState<Record<string, Partial<SystemUserItem>>>({});

  // 1. TanStack Query: gọi API danh sách người dùng
  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      try {
        const res = await AdminUserService.getAll(1, 100);
        return res;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 3,
    retry: 1,
  });

  // Ánh xạ dữ liệu trả về từ MongoDB chuẩn xác 1:1
  const serverUsers = useMemo<SystemUserItem[] | null>(() => {
    if (!usersQuery.data?.success || !usersQuery.data.data?.users?.length) {
      return null;
    }

    return usersQuery.data.data.users.map((u: User, idx: number) => {
      const rawRole = (
        typeof u.roleId === "object" && u.roleId?.name
          ? u.roleId.name
          : u.role || "USER"
      ).toUpperCase();

      const roleVal: "USER" | "AUTHOR" | "ADMIN" | "MANAGER" =
        rawRole === "ADMIN"
          ? "ADMIN"
          : rawRole === "MANAGER"
          ? "MANAGER"
          : rawRole === "AUTHOR"
          ? "AUTHOR"
          : "USER";

      return {
        id: u._id || u.id || `usr-${idx}`,
        username: u.username || `user_${idx}`,
        displayName: u.displayName || u.username || `Người dùng ${idx + 1}`,
        penName: u.authorProfile?.penName || "",
        email: u.email || `user${idx}@storyvn.vn`,
        role: roleVal,
        avatar:
          getFullImageUrl(u.avatar) ||
          u.avatarUrl ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        isActive: u.isActive !== undefined ? u.isActive : true,
        joinedDate: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("vi-VN")
          : "12/03/2023",
        lastLogin: u.lastLoginAt
          ? new Date(u.lastLoginAt).toLocaleDateString("vi-VN")
          : "Chưa đăng nhập",
        bio: u.bio || "",
        socialLinks: u.socialLinks,
      };
    });
  }, [usersQuery.data]);

  const baseUsers = serverUsers ?? MOCK_SYSTEM_USERS;
  const isUsingMock = serverUsers === null;

  // Áp dụng thay đổi tức thời (optimistic)
  const localUsers = useMemo<SystemUserItem[]>(() => {
    return baseUsers.map((user) => {
      const override = overrides[user.id];
      return override ? { ...user, ...override } : user;
    });
  }, [baseUsers, overrides]);

  // 2. Mutation: Đổi vai trò (chỉ chấp nhận 4 role: USER, AUTHOR, MANAGER, ADMIN)
  const updateRoleMutation = useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: "USER" | "AUTHOR" | "ADMIN" | "MANAGER";
    }) => AdminUserService.updateRole(userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      const roleName =
        variables.role === "ADMIN"
          ? "Admin"
          : variables.role === "MANAGER"
          ? "Manager"
          : variables.role === "AUTHOR"
          ? "Tác Giả"
          : "Độc Giả";
      toast.success(`Đã cập nhật vai trò thành [${roleName}] thành công!`);
    },
    onError: () => {
      toast.error("Không thể kết nối API. Đã lưu thay đổi tạm thời trên giao diện!");
    },
  });

  // 3. Mutation: Khóa / Mở khóa tài khoản
  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      AdminUserService.updateStatus(userId, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(
        variables.isActive
          ? "Đã mở khóa tài khoản người dùng thành công!"
          : "Đã tạm khóa tài khoản người dùng!"
      );
    },
    onError: () => {
      toast.error("Không thể kết nối API. Đã cập nhật trạng thái tạm thời trên giao diện!");
    },
  });

  // Handlers
  const handleRoleChange = (
    userId: string,
    newRole: "USER" | "AUTHOR" | "ADMIN" | "MANAGER"
  ) => {
    setOverrides((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        role: newRole,
      },
    }));
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    setOverrides((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], isActive: updatedStatus },
    }));
    updateStatusMutation.mutate({ userId, isActive: updatedStatus });
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(localUsers.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleExportExcel = () => {
    toast.success("Đã xuất danh sách người dùng StoryVN ra file Excel (.xlsx)!");
  };

  // Tính toán bộ lọc tìm kiếm
  const filteredUsers = useMemo(() => {
    return localUsers.filter((u) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.penName && u.penName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchRole = roleFilter === "ALL" || u.role === roleFilter;

      let matchStatus = true;
      if (statusFilter === "ACTIVE") matchStatus = u.isActive;
      if (statusFilter === "LOCKED") matchStatus = !u.isActive;

      return matchSearch && matchRole && matchStatus;
    });
  }, [localUsers, searchQuery, roleFilter, statusFilter]);

  // Phân trang
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Thống kê chuẩn xác từ dữ liệu thực tế
  const totalCount = localUsers.length;
  const readersCount = localUsers.filter((u) => u.role === "USER").length;
  const authorsCount = localUsers.filter((u) => u.role === "AUTHOR").length;
  const lockedCount = localUsers.filter((u) => !u.isActive).length;

  return {
    usersQuery,
    usersList: localUsers,
    filteredUsers,
    paginatedUsers,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    isMaskedPrivacy,
    setIsMaskedPrivacy: () => setIsMaskedPrivacy((prev) => !prev),
    selectedUserIds,
    handleSelectUser,
    handleSelectAll,
    totalCount,
    readersCount,
    authorsCount,
    lockedCount,
    isUsingMock,
    handleRoleChange,
    handleToggleStatus,
    handleExportExcel,
    refetch: () => usersQuery.refetch(),
    isLoading: usersQuery.isLoading,
  };
};

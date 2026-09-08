import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AdminUserService } from "../services/user.service";
import { SystemUserItem, AdminUserRole, AdminUserStatus } from "../models/user.model";
import { User } from "@/modules/client/auth/models/auth.model";
import { getFullImageUrl } from "@/common/utils/imageUrl";

const MOCK_SYSTEM_USERS: SystemUserItem[] = [
  {
    id: "usr-admin-01",
    username: "admin_storyvn",
    displayName: "Ban Quản Trị StoryVN",
    email: "admin@storyvn.com",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isEmailVerified: true,
    joinedDate: "10/01/2023",
    lastLogin: "Vừa xong",
    bio: "Quản trị viên trưởng phụ trách kiểm duyệt và vận hành hệ thống StoryVN.",
  },
  {
    id: "usr-author-01",
    username: "haidang_author",
    displayName: "Nguyễn Hải Đăng",
    email: "haidang.writer@storyvn.vn",
    role: "AUTHOR",
    penName: "Hải Đăng Tử",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isEmailVerified: true,
    joinedDate: "14/03/2023",
    lastLogin: "Hôm nay",
    bio: "Tác giả độc quyền tại StoryVN • Bộ truyện đang phát hành: Huyền Đạo Chi Thượng.",
  },
  {
    id: "usr-author-02",
    username: "tieudaotu",
    displayName: "Trần Tiêu Dao",
    email: "tieudaotu@storyvn.vn",
    role: "AUTHOR",
    penName: "Tiêu Dao Tử",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isEmailVerified: true,
    joinedDate: "20/06/2023",
    lastLogin: "Hôm qua",
    bio: "Chuyên sáng tác tiên hiệp hài hước, đấu trí sảng văn và dị giới.",
  },
  {
    id: "usr-author-03",
    username: "bachngocduong",
    displayName: "Bạch Ngọc Đường",
    email: "bachngoc@storyvn.vn",
    role: "AUTHOR",
    penName: "Bạch Ngọc Đường",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isEmailVerified: true,
    joinedDate: "05/09/2023",
    lastLogin: "3 ngày trước",
    bio: "Tác giả sáng tác kiếm hiệp truyền thống và huyền huyễn phương đông.",
  },
  {
    id: "usr-user-01",
    username: "thanhbinh_reader",
    displayName: "Lê Thanh Bình",
    email: "thanhbinh.docgia@gmail.com",
    role: "USER",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isEmailVerified: true,
    joinedDate: "12/01/2024",
    lastLogin: "Vừa xong",
    bio: "Độc giả đam mê truyện tu tiên và huyền huyễn cổ điển.",
  },
  {
    id: "usr-user-02",
    username: "minhanh_novels",
    displayName: "Trần Minh Anh",
    email: "minhanh.reader@gmail.com",
    role: "USER",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isEmailVerified: true,
    joinedDate: "18/02/2024",
    lastLogin: "2 ngày trước",
    bio: "Yêu thích tiểu thuyết kỳ ảo phương tây và ngôn tình dị giới.",
  },
  {
    id: "usr-user-03",
    username: "quoctuan99",
    displayName: "Phạm Quốc Tuấn",
    email: "quoctuan99@gmail.com",
    role: "USER",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80",
    isActive: false,
    isEmailVerified: false,
    joinedDate: "01/03/2024",
    lastLogin: "1 tuần trước",
    bio: "Tài khoản đang tạm khóa do vi phạm quy định ngôn luận diễn đàn.",
  },
  {
    id: "usr-user-04",
    username: "thutrang_vn",
    displayName: "Vũ Thu Trang",
    email: "thutrang.novels@gmail.com",
    role: "USER",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    isActive: true,
    isEmailVerified: true,
    joinedDate: "25/04/2024",
    lastLogin: "Hôm qua",
    bio: "Độc giả trung thành của các tác phẩm tiên hiệp tại StoryVN.",
  },
];

export const useAdminUsers = (initialPageSize = 8) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminUserRole>("ALL");
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = initialPageSize;

  // Local optimistic overrides map: userId -> partial overrides
  const [overrides, setOverrides] = useState<Record<string, Partial<SystemUserItem>>>({});

  // 1. TanStack Query: fetch users list
  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await AdminUserService.getAll(1, 100);
      return res;
    },
    staleTime: 1000 * 60 * 3, // Cache 3 phút
    retry: 1,
  });

  // Map server users if available
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
          : rawRole === "AUTHOR"
          ? "AUTHOR"
          : rawRole === "MANAGER"
          ? "MANAGER"
          : "USER";

      return {
        id: u._id || u.id || `usr-${idx}`,
        username: u.username || `user_${idx}`,
        displayName: u.displayName || u.username || `Người dùng ${idx + 1}`,
        email: u.email || `user${idx}@storyvn.vn`,
        role: roleVal,
        avatar:
          getFullImageUrl(u.avatar) ||
          u.avatarUrl ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        isActive: u.isActive !== undefined ? u.isActive : true,
        isEmailVerified: u.isEmailVerified !== undefined ? u.isEmailVerified : true,
        joinedDate: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("vi-VN")
          : "Vừa xong",
        lastLogin: u.lastLoginAt
          ? new Date(u.lastLoginAt).toLocaleDateString("vi-VN")
          : "Gần đây",
        bio: u.bio || "",
        penName: u.authorProfile?.penName || "",
      };
    });
  }, [usersQuery.data]);

  const baseUsers = serverUsers ?? MOCK_SYSTEM_USERS;
  const isUsingMock = serverUsers === null;

  // Apply optimistic overrides
  const localUsers = useMemo<SystemUserItem[]>(() => {
    return baseUsers.map((user) => {
      const override = overrides[user.id];
      return override ? { ...user, ...override } : user;
    });
  }, [baseUsers, overrides]);

  // 2. Mutation: Đổi vai trò người dùng
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "USER" | "AUTHOR" | "ADMIN" }) =>
      AdminUserService.updateRole(userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(`Đã đổi vai trò sang ${variables.role}!`);
    },
    onError: () => {
      // Optimistic state was applied
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
          : "Đã khóa tài khoản người dùng!"
      );
    },
    onError: () => {
      // Optimistic state was applied
    },
  });

  // Handlers
  const handleRoleChange = (userId: string, newRole: "USER" | "AUTHOR" | "ADMIN") => {
    setOverrides((prev) => ({ ...prev, [userId]: { ...prev[userId], role: newRole } }));
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;
    setOverrides((prev) => ({ ...prev, [userId]: { ...prev[userId], isActive: updatedStatus } }));
    updateStatusMutation.mutate({ userId, isActive: updatedStatus });
  };

  // Filter & Search computation
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
      if (statusFilter === "INACTIVE") matchStatus = !u.isActive;

      return matchSearch && matchRole && matchStatus;
    });
  }, [localUsers, searchQuery, roleFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Stats calculation
  const totalCount = localUsers.length;
  const userRoleCount = localUsers.filter((u) => u.role === "USER").length;
  const authorRoleCount = localUsers.filter((u) => u.role === "AUTHOR").length;
  const adminRoleCount = localUsers.filter((u) => u.role === "ADMIN").length;
  const activeCount = localUsers.filter((u) => u.isActive).length;

  return {
    usersQuery,
    updateRoleMutation,
    updateStatusMutation,
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
    totalCount,
    userRoleCount,
    authorRoleCount,
    adminRoleCount,
    activeCount,
    isUsingMock,
    handleRoleChange,
    handleToggleStatus,
    refetch: () => usersQuery.refetch(),
    isLoading: usersQuery.isLoading,
  };
};

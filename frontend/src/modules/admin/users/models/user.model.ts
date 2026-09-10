import { User } from "@/modules/client/auth/models/auth.model";

export type AdminUserRole = "ALL" | "USER" | "AUTHOR" | "ADMIN" | "MANAGER";
export type AdminUserStatus = "ALL" | "ACTIVE" | "LOCKED";

/**
 * Model người dùng chuẩn hóa 1:1 theo MongoDB Database Schema:
 * - username: Tên đăng nhập
 * - displayName: Tên hiển thị
 * - email: Địa chỉ email
 * - avatar: Ảnh đại diện
 * - role: Phân quyền (USER, AUTHOR, MANAGER, ADMIN)
 * - penName: Bút danh (đối với Tác Giả)
 * - bio: Giới thiệu bản thân
 * - isActive: Trạng thái tài khoản (Hoạt động / Tạm khóa)
 * - socialLinks: Liên kết mạng xã hội (Facebook, Twitter)
 * - joinedDate: Ngày đăng ký tài khoản (createdAt)
 * - lastLogin: Thời gian đăng nhập gần nhất (lastLoginAt)
 */
export interface SystemUserItem {
  id: string;
  username: string;
  displayName: string;
  penName?: string;
  email: string;
  role: "USER" | "AUTHOR" | "ADMIN" | "MANAGER";
  avatar: string;
  isActive: boolean;
  joinedDate: string;
  lastLogin: string;
  bio?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
  };
}

export interface AdminUsersPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminUsersResponse {
  users: User[];
  pagination: AdminUsersPagination;
}

export interface UpdateUserRoleDto {
  userId: string;
  role: "USER" | "AUTHOR" | "ADMIN" | "MANAGER";
}

export interface UpdateUserStatusDto {
  userId: string;
  isActive: boolean;
}

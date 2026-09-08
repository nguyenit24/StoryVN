import { User } from "@/modules/client/auth/models/auth.model";

export type AdminUserRole = "ALL" | "USER" | "AUTHOR" | "ADMIN" | "MANAGER";
export type AdminUserStatus = "ALL" | "ACTIVE" | "INACTIVE";

export interface SystemUserItem {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: "USER" | "AUTHOR" | "ADMIN" | "MANAGER";
  avatar: string;
  isActive: boolean;
  isEmailVerified: boolean;
  joinedDate: string;
  lastLogin: string;
  bio?: string;
  penName?: string;
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
  role: "USER" | "AUTHOR" | "ADMIN";
}

export interface UpdateUserStatusDto {
  userId: string;
  isActive: boolean;
}

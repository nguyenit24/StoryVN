import { AdminUserService } from "@/modules/admin/users/services/user.service";
import { ProfileService } from "@/modules/client/profile/services/profile.service";

export const usersApi = {
  // Admin methods
  getAll: AdminUserService.getAll,
  getAllUsers: AdminUserService.getAll,
  updateRole: AdminUserService.updateRole,
  updateUserRole: AdminUserService.updateRole,
  updateStatus: AdminUserService.updateStatus,
  updateUserStatus: AdminUserService.updateStatus,
  getById: AdminUserService.getById,
  getByIdentifier: AdminUserService.getById,
  getStats: AdminUserService.getStats,

  // Profile methods
  getProfile: ProfileService.getProfile,
  updateProfile: ProfileService.updateProfile,
  changePassword: ProfileService.changePassword,
  uploadAvatar: ProfileService.uploadAvatar,
};

export * from "@/modules/admin/users/services/user.service";
export * from "@/modules/client/profile/services/profile.service";

import api from "@/config/api";
import { API_ROUTES } from "@/config/apiRoutes";
import {
  ApiResponse,
  ChangePasswordDto,
  UpdateProfileDto,
  UploadImageResponseData,
  User,
} from "@/modules/client/auth/models/auth.model";

export const ProfileService = {
  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const res = await api.get<ApiResponse<{ user: User }>>(
      API_ROUTES.USERS.PROFILE
    );
    return res.data;
  },

  async updateProfile(
    dto: UpdateProfileDto
  ): Promise<ApiResponse<{ user: User }>> {
    const res = await api.patch<ApiResponse<{ user: User }>>(
      API_ROUTES.USERS.PROFILE,
      dto
    );
    return res.data;
  },

  async changePassword(dto: ChangePasswordDto): Promise<ApiResponse<null>> {
    const res = await api.post<ApiResponse<null>>(
      API_ROUTES.USERS.CHANGE_PASSWORD,
      dto
    );
    return res.data;
  },

  async uploadAvatar(
    file: File
  ): Promise<ApiResponse<UploadImageResponseData>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "avatars");

    const res = await api.post<ApiResponse<UploadImageResponseData>>(
      API_ROUTES.UPLOAD.IMAGE,
      formData
    );
    return res.data;
  },
};

import api from "@/config/api";
import { API_ROUTES } from "@/config/apiRoutes";
import { ApiResponse, AuthorProfileInfo, UploadImageResponseData } from "@/modules/client/auth/models/auth.model";
import {
  UpdateAuthorProfileDto,
  UpgradeAuthorDto,
  UpgradeAuthorResponseData,
} from "../models/profile.model";

export const AuthorService = {
  async upgradeToAuthor(
    dto: UpgradeAuthorDto
  ): Promise<ApiResponse<UpgradeAuthorResponseData>> {
    const res = await api.post<ApiResponse<UpgradeAuthorResponseData>>(
      API_ROUTES.AUTHORS.UPGRADE,
      dto
    );
    return res.data;
  },

  async getMyAuthorProfile(): Promise<ApiResponse<{ profile: AuthorProfileInfo }>> {
    const res = await api.get<ApiResponse<{ profile: AuthorProfileInfo }>>(
      API_ROUTES.AUTHORS.ME
    );
    return res.data;
  },

  async updateMyAuthorProfile(
    dto: UpdateAuthorProfileDto
  ): Promise<ApiResponse<{ profile: AuthorProfileInfo }>> {
    const res = await api.patch<ApiResponse<{ profile: AuthorProfileInfo }>>(
      API_ROUTES.AUTHORS.ME,
      dto
    );
    return res.data;
  },

  async uploadCoverImage(
    file: File
  ): Promise<ApiResponse<UploadImageResponseData>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "covers");

    const res = await api.post<ApiResponse<UploadImageResponseData>>(
      API_ROUTES.UPLOAD.IMAGE,
      formData
    );
    return res.data;
  },
};

// Backward compatibility alias
export const authorApi = AuthorService;


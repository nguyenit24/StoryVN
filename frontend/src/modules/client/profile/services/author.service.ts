import api from "@/config/api";
import { API_ROUTES } from "@/config/apiRoutes";
import { ApiResponse, AuthorProfileInfo } from "@/modules/client/auth/models/auth.model";
import { UpgradeAuthorDto, UpgradeAuthorResponseData } from "../models/profile.model";

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

  async getMyAuthorProfile(): Promise<ApiResponse<AuthorProfileInfo>> {
    const res = await api.get<ApiResponse<AuthorProfileInfo>>(
      API_ROUTES.AUTHORS.ME
    );
    return res.data;
  },
};

// Backward compatibility alias
export const authorApi = AuthorService;

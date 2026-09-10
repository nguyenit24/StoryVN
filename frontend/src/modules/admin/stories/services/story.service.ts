import api from "@/config/api";
import { API_ROUTES } from "@/config/apiRoutes";
import {
  AdminStoriesResponse,
  AdminStoryFilters,
} from "../models/story.model";

export const AdminStoryService = {
  getAll: async (filters?: AdminStoryFilters): Promise<AdminStoriesResponse> => {
    const params: Record<string, string | number | boolean> = {
      page: filters?.page || 1,
      limit: filters?.limit || 20,
    };

    if (filters?.search?.trim()) {
      params.search = filters.search.trim();
    }

    if (filters?.status && filters.status !== "ALL") {
      params.status = filters.status;
    }

    if (filters?.isVip !== undefined && filters.isVip !== "ALL") {
      params.isVip = filters.isVip;
    }

    const res = await api.get<AdminStoriesResponse>(API_ROUTES.STORIES.ADMIN_LIST, {
      params,
    });
    return res.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(API_ROUTES.STORIES.DELETE(id));
    return res.data;
  },
};

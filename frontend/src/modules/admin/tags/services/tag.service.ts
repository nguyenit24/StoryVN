import api from "@/config/api";
import { API_ROUTES } from "@/config/apiRoutes";
import {
  TagItem,
  CreateTagInput,
  UpdateTagInput,
  AdminTagFilters,
  AdminTagsResponse,
} from "../models/tag.model";

export const AdminTagService = {
  getAll: async (params?: AdminTagFilters): Promise<AdminTagsResponse> => {
    const res = await api.get<AdminTagsResponse>(API_ROUTES.TAGS.LIST, {
      params: {
        page: params?.page,
        limit: params?.limit,
        search: params?.search?.trim() || undefined,
      },
    });
    return res.data;
  },

  create: async (data: CreateTagInput): Promise<TagItem> => {
    const res = await api.post<TagItem>(API_ROUTES.TAGS.CREATE, data);
    return res.data;
  },

  update: async (id: string, data: UpdateTagInput): Promise<TagItem> => {
    const res = await api.patch<TagItem>(API_ROUTES.TAGS.UPDATE(id), data);
    return res.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(API_ROUTES.TAGS.DELETE(id));
    return res.data;
  },

  seed: async (): Promise<{ count: number; message: string; totalTags: number }> => {
    const res = await api.post<{ count: number; message: string; totalTags: number }>(
      API_ROUTES.TAGS.SEED
    );
    return res.data;
  },
};

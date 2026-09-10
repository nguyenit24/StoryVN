import api from "@/config/api";
import { API_ROUTES } from "@/config/apiRoutes";
import {
  CategoryItem,
  CreateCategoryInput,
  UpdateCategoryInput,
  AdminCategoryFilters,
  AdminCategoriesResponse,
} from "../models/category.model";

export const AdminCategoryService = {
  getAll: async (params?: AdminCategoryFilters): Promise<AdminCategoriesResponse> => {
    const res = await api.get<AdminCategoriesResponse>(API_ROUTES.CATEGORIES.LIST, {
      params: {
        page: params?.page,
        limit: params?.limit,
        search: params?.search?.trim() || undefined,
      },
    });
    return res.data;
  },

  create: async (data: CreateCategoryInput): Promise<CategoryItem> => {
    const res = await api.post<CategoryItem>(API_ROUTES.CATEGORIES.CREATE, data);
    return res.data;
  },

  update: async (id: string, data: UpdateCategoryInput): Promise<CategoryItem> => {
    const res = await api.patch<CategoryItem>(API_ROUTES.CATEGORIES.UPDATE(id), data);
    return res.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(API_ROUTES.CATEGORIES.DELETE(id));
    return res.data;
  },

  seed: async (): Promise<{ count: number; message: string; totalCategories: number }> => {
    const res = await api.post<{ count: number; message: string; totalCategories: number }>(
      API_ROUTES.CATEGORIES.SEED
    );
    return res.data;
  },
};

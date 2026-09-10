export interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
}

export interface AdminCategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AdminCategoriesResponse {
  data: CategoryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

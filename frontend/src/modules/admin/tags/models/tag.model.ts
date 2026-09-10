export interface TagItem {
  _id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTagInput {
  name: string;
  description?: string;
}

export interface UpdateTagInput {
  name?: string;
  description?: string;
}

export interface AdminTagFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AdminTagsResponse {
  data: TagItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

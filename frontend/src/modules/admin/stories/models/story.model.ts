export type StoryStatusType = "DRAFT" | "ONGOING" | "COMPLETED" | "PAUSED";

export interface StoryAuthor {
  _id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  email?: string;
}

export interface StoryCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface StoryTag {
  _id: string;
  name: string;
  slug: string;
}

export interface AdminStoryItem {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverUrl?: string | null;
  status: StoryStatusType;
  isVip: boolean;
  authorId?: StoryAuthor | string;
  categoryIds?: StoryCategory[];
  tagIds?: StoryTag[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminStoriesResponse {
  data: AdminStoryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminStoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: StoryStatusType | "ALL";
  isVip?: boolean | "ALL";
}

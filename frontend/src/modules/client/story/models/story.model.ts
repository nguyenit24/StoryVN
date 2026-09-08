export interface ChapterInfo {
  chapterNum: number;
  title: string;
  updatedAt: string;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  author: string;
  genres: string[];
  genreBadge?: string;
  synopsis: string;
  coverImage: string;
  bannerImage?: string;
  coverGradient: string;
  rating: number;
  reviewCount: number | string;
  views: number;
  viewsText?: string;
  chaptersCount: number;
  status: "Đang ra" | "Hoàn thành";
  isHot?: boolean;
  isFeatured?: boolean;
  badge?: "HOT" | "FULL" | "NEW" | "ĐÃ HOÀN";
  latestChapter: ChapterInfo;
  rankDaily?: number;
  rankWeekly?: number;
  rankMonthly?: number;
}

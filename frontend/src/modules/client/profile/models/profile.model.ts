import { AuthorProfileInfo } from "@/modules/client/auth/models/auth.model";

export interface UpgradeAuthorDto {
  penName: string;
  writingStyle?: string;
  coverImage?: string;
  authorSince?: string;
}

export interface UpgradeAuthorResponseData {
  profile: AuthorProfileInfo;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export type ProfileTab = "works" | "library" | "history" | "forum" | "badges";
export type ReadingTheme = "light" | "sepia" | "green" | "dark";

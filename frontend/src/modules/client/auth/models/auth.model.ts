export interface SocialLinksDto {
  facebook?: string;
  twitter?: string;
}

export interface AuthorProfileInfo {
  penName: string;
  writingStyle?: string;
  coverImage?: string;
  authorSince?: string;
  stats?: {
    totalStories?: number;
    totalChapters?: number;
    totalViews?: number;
    totalFollowers?: number;
  };
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
}

export type Role = "ADMIN" | "AUTHOR" | "USER" | "MANAGER" | "staff" | "admin" | "user" | string;

export interface User {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  avatarUrl?: string;
  bio?: string;
  socialLinks?: SocialLinksDto;
  role?: Role;
  roleId?: {
    _id?: string;
    name?: string;
    description?: string;
    isActive?: boolean;
  } | string;
  permissions?: Permission[];
  isActive?: boolean;
  isEmailVerified?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  authorProfile?: AuthorProfileInfo | null;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthLoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
}

export interface LogoutDto {
  refreshToken?: string;
}

export interface UpdateProfileDto {
  displayName?: string;
  avatar?: string;
  bio?: string;
  socialLinks?: SocialLinksDto;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UploadImageResponseData {
  url: string;
  publicId?: string;
  storageMode?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

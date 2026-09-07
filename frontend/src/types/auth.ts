export interface User {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  displayName?: string;
  role?: string;
  roleId?: {
    name?: string;
    description?: string;
    isActive?: boolean;
  } | string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  avatarUrl?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

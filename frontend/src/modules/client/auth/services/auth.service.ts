import api from "@/config/api";
import { API_ROUTES } from "@/config/apiRoutes";
import { getRefreshToken } from "@/common/utils/token";
import {
  ApiResponse,
  AuthLoginResponseData,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  User,
  VerifyOtpDto,
} from "../models/auth.model";

export const AuthService = {
  async login(dto: LoginDto): Promise<ApiResponse<AuthLoginResponseData>> {
    const res = await api.post<ApiResponse<AuthLoginResponseData>>(
      API_ROUTES.AUTH.LOGIN,
      dto
    );
    return res.data;
  },

  async register(dto: RegisterDto): Promise<ApiResponse<null>> {
    const res = await api.post<ApiResponse<null>>(
      API_ROUTES.AUTH.REGISTER,
      dto
    );
    return res.data;
  },

  async verifyOtp(dto: VerifyOtpDto): Promise<ApiResponse<null>> {
    const res = await api.post<ApiResponse<null>>(
      API_ROUTES.AUTH.VERIFY_OTP,
      dto
    );
    return res.data;
  },

  async forgotPassword(dto: ForgotPasswordDto): Promise<ApiResponse<null>> {
    const res = await api.post<ApiResponse<null>>(
      API_ROUTES.AUTH.FORGOT_PASSWORD,
      dto
    );
    return res.data;
  },

  async resetPassword(dto: ResetPasswordDto): Promise<ApiResponse<null>> {
    const res = await api.post<ApiResponse<null>>(
      API_ROUTES.AUTH.RESET_PASSWORD,
      dto
    );
    return res.data;
  },

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    const res = await api.get<ApiResponse<{ user: User }>>(
      API_ROUTES.AUTH.ME
    );
    return res.data;
  },

  async logout(refreshToken?: string): Promise<ApiResponse<null>> {
    const payload = refreshToken ? { refreshToken } : {};
    const res = await api.post<ApiResponse<null>>(
      API_ROUTES.AUTH.LOGOUT,
      payload
    );
    return res.data;
  },

  async logoutCurrentSession(): Promise<ApiResponse<null>> {
    const refreshToken = getRefreshToken();
    return this.logout(refreshToken || undefined);
  },

  async logoutAllSessions(): Promise<ApiResponse<null>> {
    return this.logout(undefined);
  },

  async loginWithGoogle(dto: { credential: string }): Promise<ApiResponse<AuthLoginResponseData>> {
    const res = await api.post<ApiResponse<AuthLoginResponseData>>(
      API_ROUTES.AUTH.GOOGLE,
      dto
    );
    return res.data;
  },
};

// Backward compatibility alias
export const authApi = AuthService;

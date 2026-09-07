import api from "./client";
import { API_ENDPOINTS } from "./endpoints";
import {
  ApiResponse,
  AuthLoginResponseData,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  User,
  VerifyOtpDto,
} from "@/types/auth";

export const authApi = {
  async login(dto: LoginDto): Promise<ApiResponse<AuthLoginResponseData>> {
    const res = await api.post<ApiResponse<AuthLoginResponseData>>(
      API_ENDPOINTS.AUTH.LOGIN,
      dto
    );
    return res.data;
  },

  async register(dto: RegisterDto): Promise<ApiResponse<null>> {
    const res = await api.post<ApiResponse<null>>(
      API_ENDPOINTS.AUTH.REGISTER,
      dto
    );
    return res.data;
  },

  async verifyOtp(dto: VerifyOtpDto): Promise<ApiResponse<null>> {
    const res = await api.post<ApiResponse<null>>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      dto
    );
    return res.data;
  },

  async forgotPassword(dto: ForgotPasswordDto): Promise<ApiResponse<null>> {
    const res = await api.post<ApiResponse<null>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      dto
    );
    return res.data;
  },

  async resetPassword(dto: ResetPasswordDto): Promise<ApiResponse<null>> {
    const res = await api.post<ApiResponse<null>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      dto
    );
    return res.data;
  },

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    const res = await api.get<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.AUTH.ME
    );
    return res.data;
  },

  async logout(refreshToken?: string): Promise<ApiResponse<null>> {
    const res = await api.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT, {
      refreshToken,
    });
    return res.data;
  },
};


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthService } from './auth.service.js';
import { RoleType } from '../../roles/schemas/role.schema.js';

describe('AuthService - loginWithGoogle', () => {
  let authService: AuthService;
  let mockUserModel: any;
  let mockTokenBlacklistModel: any;
  let mockRedisService: any;
  let mockRolesService: any;
  let mockMailService: any;
  let mockJwtService: any;
  let mockConfigService: any;

  const mockRoleId = new Types.ObjectId();
  const mockRole = {
    _id: mockRoleId,
    name: RoleType.USER,
    isActive: true,
  };

  beforeEach(() => {
    mockUserModel = {
      findOne: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      exists: vi.fn(),
      updateOne: vi.fn(),
    };

    mockTokenBlacklistModel = {
      findOne: vi.fn(),
      updateOne: vi.fn(),
    };

    mockRedisService = {
      del: vi.fn(),
      setJson: vi.fn(),
      getJson: vi.fn(),
      ttl: vi.fn(),
    };

    mockRolesService = {
      findByName: vi.fn().mockResolvedValue(mockRole),
      findById: vi.fn().mockResolvedValue(mockRole),
    };

    mockMailService = {
      sendOtpEmail: vi.fn(),
      sendForgotPasswordOtpEmail: vi.fn(),
    };

    mockJwtService = {
      signAsync: vi.fn().mockImplementation((payload) => {
        return Promise.resolve(`mock_token_for_${payload.sub || 'unknown'}`);
      }),
      verifyAsync: vi.fn(),
    };

    mockConfigService = {
      get: vi.fn((key: string) => {
        switch (key) {
          case 'GOOGLE_CLIENT_ID':
            return 'test-google-client-id.apps.googleusercontent.com';
          case 'JWT_ACCESS_SECRET':
            return 'test-access-secret';
          case 'JWT_REFRESH_SECRET':
            return 'test-refresh-secret';
          default:
            return undefined;
        }
      }),
    };

    authService = new AuthService(
      mockUserModel,
      mockTokenBlacklistModel,
      mockRedisService,
      mockRolesService,
      mockMailService,
      mockJwtService,
      mockConfigService,
    );
  });

  it('should throw BadRequestException if GOOGLE_CLIENT_ID is not configured', async () => {
    const unconfiguredConfigService = {
      get: vi.fn().mockReturnValue(''),
    };
    const unconfiguredService = new AuthService(
      mockUserModel,
      mockTokenBlacklistModel,
      mockRedisService,
      mockRolesService,
      mockMailService,
      mockJwtService,
      unconfiguredConfigService as any,
    );

    await expect(
      unconfiguredService.loginWithGoogle({ credential: 'any_credential' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw UnauthorizedException if verifyIdToken fails', async () => {
    // Mock verifyIdToken to throw
    vi.spyOn((authService as any).googleClient, 'verifyIdToken').mockRejectedValue(
      new Error('Invalid token signature'),
    );

    await expect(
      authService.loginWithGoogle({ credential: 'invalid_credential' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if email is not verified', async () => {
    vi.spyOn((authService as any).googleClient, 'verifyIdToken').mockResolvedValue({
      getPayload: () => ({
        email: 'unverified@gmail.com',
        email_verified: false,
      }),
    } as any);

    await expect(
      authService.loginWithGoogle({ credential: 'valid_token_unverified_email' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should log in existing user if email is already in database', async () => {
    vi.spyOn((authService as any).googleClient, 'verifyIdToken').mockResolvedValue({
      getPayload: () => ({
        email: 'user@gmail.com',
        email_verified: true,
        name: 'Existing User',
        picture: 'https://lh3.googleusercontent.com/avatar.jpg',
      }),
    } as any);

    const existingUser = {
      _id: new Types.ObjectId(),
      username: 'existinguser',
      email: 'user@gmail.com',
      roleId: mockRoleId,
      isActive: true,
      tokenVersion: 0,
      avatar: '',
      lastLoginAt: null,
      save: vi.fn().mockResolvedValue(true),
    };

    mockUserModel.findOne.mockReturnValue({
      exec: vi.fn().mockResolvedValue(existingUser),
    });

    const result = await authService.loginWithGoogle({ credential: 'valid_token' });

    expect(result.success).toBe(true);
    expect(result.message).toBe('Đăng nhập thành công');
    expect(result.data.user.email).toBe('user@gmail.com');
    expect(result.data.user.username).toBe('existinguser');
    expect(result.data.accessToken).toBeDefined();
    expect(result.data.refreshToken).toBeDefined();
    expect(existingUser.save).toHaveBeenCalled();
    expect(existingUser.avatar).toBe('https://lh3.googleusercontent.com/avatar.jpg');
    expect(mockUserModel.create).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException if existing user account is locked/inactive', async () => {
    vi.spyOn((authService as any).googleClient, 'verifyIdToken').mockResolvedValue({
      getPayload: () => ({
        email: 'locked@gmail.com',
        email_verified: true,
        name: 'Locked User',
      }),
    } as any);

    const inactiveUser = {
      _id: new Types.ObjectId(),
      username: 'lockeduser',
      email: 'locked@gmail.com',
      roleId: mockRoleId,
      isActive: false,
      save: vi.fn(),
    };

    mockUserModel.findOne.mockReturnValue({
      exec: vi.fn().mockResolvedValue(inactiveUser),
    });

    await expect(
      authService.loginWithGoogle({ credential: 'valid_token' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should create a new user when email does not exist in database', async () => {
    vi.spyOn((authService as any).googleClient, 'verifyIdToken').mockResolvedValue({
      getPayload: () => ({
        email: 'newuser@gmail.com',
        email_verified: true,
        name: 'New Google User',
        picture: 'https://lh3.googleusercontent.com/new.jpg',
      }),
    } as any);

    mockUserModel.findOne.mockReturnValue({
      exec: vi.fn().mockResolvedValue(null),
    });
    mockUserModel.exists.mockResolvedValue(null);

    const createdUserId = new Types.ObjectId();
    mockUserModel.create.mockImplementation((doc: any) => ({
      _id: createdUserId,
      ...doc,
    }));

    const result = await authService.loginWithGoogle({ credential: 'valid_token' });

    expect(result.success).toBe(true);
    expect(result.message).toBe('Đăng nhập thành công');
    expect(result.data.user.email).toBe('newuser@gmail.com');
    expect(result.data.accessToken).toBeDefined();
    expect(result.data.refreshToken).toBeDefined();

    expect(mockUserModel.create).toHaveBeenCalledTimes(1);
    const createdArg = mockUserModel.create.mock.calls[0][0];
    expect(createdArg.email).toBe('newuser@gmail.com');
    expect(createdArg.username).toBe('newuser');
    expect(createdArg.password).toBeDefined();
    expect(createdArg.roleId).toEqual(mockRoleId);
    expect(createdArg.isActive).toBe(true);
    expect(createdArg.tokenVersion).toBe(0);
  });
});

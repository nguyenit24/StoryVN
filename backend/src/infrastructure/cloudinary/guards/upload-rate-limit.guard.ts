import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../redis/redis.service.js';

@Injectable()
export class UploadRateLimitGuard implements CanActivate {
  private readonly logger = new Logger(UploadRateLimitGuard.name);
  private readonly maxRequests: number;
  private readonly windowSeconds: number;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.maxRequests = Number(this.configService.get<number>('UPLOAD_RATE_LIMIT_MAX') ?? 15);
    this.windowSeconds = Number(this.configService.get<number>('UPLOAD_RATE_LIMIT_WINDOW_SECONDS') ?? 60);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const identifier = request.user?.sub || request.ip || 'anonymous';
    const key = `ratelimit:upload:${identifier}`;

    try {
      const client = this.redisService.getClient();
      const current = await client.incr(key);

      if (current === 1) {
        await client.expire(key, this.windowSeconds);
      }

      const ttl = await client.ttl(key);
      const remaining = Math.max(0, this.maxRequests - current);

      if (response && typeof response.setHeader === 'function') {
        response.setHeader('X-RateLimit-Limit', this.maxRequests);
        response.setHeader('X-RateLimit-Remaining', remaining);
        response.setHeader('X-RateLimit-Reset', ttl > 0 ? ttl : this.windowSeconds);
      }

      if (current > this.maxRequests) {
        const waitSeconds = ttl > 0 ? ttl : this.windowSeconds;
        throw new HttpException(
          `Bạn đã thực hiện quá nhiều yêu cầu upload. Giới hạn tối đa ${this.maxRequests} lần/${this.windowSeconds} giây. Vui lòng thử lại sau ${waitSeconds} giây.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      return true;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.warn(`Redis rate limit error, bypass check: ${error?.message || error}`);
      return true;
    }
  }
}

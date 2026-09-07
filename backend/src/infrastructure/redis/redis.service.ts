import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';

    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      retryStrategy(times: number) {
        return Math.min(times * 50, 2000);
      },
    });

    this.client.on('error', (err: Error) => {
      this.logger.error(`Redis connection error: ${err.message}`);
    });

    this.client.on('connect', () => {
      this.logger.log('Redis client connected');
    });
  }

  getClient(): Redis {
    return this.client;
  }

  /**
   * Lấy giá trị chuỗi theo key
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Lưu giá trị chuỗi theo key, kèm TTL (giây) tuỳ chọn
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK' | null> {
    if (ttlSeconds && ttlSeconds > 0) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    }
    return this.client.set(key, value);
  }

  /**
   * Lấy dữ liệu dạng JSON theo key và deserialize thành object kiểu T
   */
  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.get(key);
    if (!data) {
      return null;
    }
    try {
      return JSON.parse(data) as T;
    } catch (err: any) {
      this.logger.error(`Lỗi parse JSON cho Redis key "${key}": ${err?.message || err}`);
      return null;
    }
  }

  /**
   * Serialize object kiểu T thành JSON và lưu vào Redis kèm TTL (giây) tuỳ chọn
   */
  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<'OK' | null> {
    const serialized = JSON.stringify(value);
    return this.set(key, serialized, ttlSeconds);
  }

  /**
   * Xóa một hoặc nhiều key khỏi Redis
   */
  async del(...keys: string[]): Promise<number> {
    if (!keys.length) {
      return 0;
    }
    return this.client.del(...keys);
  }

  /**
   * Lấy thời gian sống còn lại (TTL) của key tính theo giây
   */
  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  /**
   * Kiểm tra một hoặc nhiều key có tồn tại trong Redis không
   */
  async exists(...keys: string[]): Promise<boolean> {
    if (!keys.length) {
      return false;
    }
    const count = await this.client.exists(...keys);
    return count > 0;
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.client.quit();
    } catch {
      this.client.disconnect();
    }
  }
}

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private isRedisConnected = false;
  private inMemoryCache = new Map<string, { value: any; expiresAt: number }>();

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.client = createClient({
        socket: {
          host: this.configService.get('REDIS_HOST') || 'localhost',
          port: this.configService.get('REDIS_PORT') || 6379,
          reconnectStrategy: (retries) => Math.min(retries * 50, 500),
        },
      });

      this.client.on('error', (err) => {
        console.warn('⚠️  Redis Client Error:', err);
      });

      await this.client.connect();
      this.isRedisConnected = true;
      console.log('✅ Redis cache connected successfully');
    } catch (error) {
      console.warn('⚠️  Redis connection failed, using in-memory cache:', error);
      this.isRedisConnected = false;
    }
  }

  async onModuleDestroy() {
    if (this.isRedisConnected && this.client) {
      try {
        await this.client.quit();
      } catch (error) {
        console.error('Error closing Redis connection:', error);
      }
    }
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | undefined> {
    try {
      if (this.isRedisConnected && this.client) {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : undefined;
      } else {
        return this.getFromMemory(key);
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return undefined;
    }
  }

  /**
   * Set a value in cache with TTL (in milliseconds)
   */
  async set<T>(key: string, value: T, ttlMs: number = 600000): Promise<void> {
    try {
      if (this.isRedisConnected && this.client) {
        const ttlSeconds = Math.ceil(ttlMs / 1000);
        await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
      } else {
        const expiresAt = Date.now() + ttlMs;
        this.inMemoryCache.set(key, { value, expiresAt });
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete a value from cache
   */
  async del(key: string): Promise<void> {
    try {
      if (this.isRedisConnected && this.client) {
        await this.client.del(key);
      } else {
        this.inMemoryCache.delete(key);
      }
    } catch (error) {
      console.error('Cache del error:', error);
    }
  }

  /**
   * Delete all cache entries matching a pattern
   */
  async delByPattern(pattern: string): Promise<void> {
    try {
      if (this.isRedisConnected && this.client) {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(keys);
        }
      } else {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        for (const key of this.inMemoryCache.keys()) {
          if (regex.test(key)) {
            this.inMemoryCache.delete(key);
          }
        }
      }
    } catch (error) {
      console.error('Cache delByPattern error:', error);
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    try {
      if (this.isRedisConnected && this.client) {
        await this.client.flushDb();
      } else {
        this.inMemoryCache.clear();
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  private getFromMemory<T>(key: string): T | undefined {
    const entry = this.inMemoryCache.get(key);
    if (!entry) {
      return undefined;
    }
    if (Date.now() > entry.expiresAt) {
      this.inMemoryCache.delete(key);
      return undefined;
    }
    return entry.value;
  }
}

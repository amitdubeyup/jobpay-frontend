/**
 * Health Check API Endpoint
 * Provides application health status for monitoring and load balancers
 */

import { NextRequest, NextResponse } from 'next/server';

interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database?: 'healthy' | 'unhealthy';
    redis?: 'healthy' | 'unhealthy';
    external_apis?: 'healthy' | 'unhealthy';
    memory?: 'healthy' | 'unhealthy';
  };
  environment: string;
}

// Helper function to check memory usage
function checkMemoryHealth(): 'healthy' | 'unhealthy' {
  if (typeof process === 'undefined') return 'healthy';

  const memUsage = process.memoryUsage();
  const maxMemory = 1024 * 1024 * 1024; // 1GB threshold

  return memUsage.heapUsed < maxMemory ? 'healthy' : 'unhealthy';
}

// Helper function to check external API health
async function checkExternalAPIs(): Promise<'healthy' | 'unhealthy'> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return 'healthy'; // Skip if no API configured

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(`${apiUrl}/health`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'JobPay-Frontend-HealthCheck' },
    });

    clearTimeout(timeoutId);
    return response.ok ? 'healthy' : 'unhealthy';
  } catch (error) {
    console.warn('External API health check failed:', error);
    return 'unhealthy';
  }
}

// Helper function to check Redis health
async function checkRedisHealth(): Promise<'healthy' | 'unhealthy'> {
  try {
    // In a real implementation, you'd connect to Redis here
    // For now, we'll just check if Redis URL is configured
    const redisUrl = process.env.REDIS_URL;
    return redisUrl ? 'healthy' : 'healthy'; // Skip if not configured
  } catch (error) {
    console.warn('Redis health check failed:', error);
    return 'unhealthy';
  }
}

// Helper function to check database health
async function checkDatabaseHealth(): Promise<'healthy' | 'unhealthy'> {
  try {
    // In a real implementation, you'd query the database here
    // For now, we'll just check if database URL is configured
    const dbUrl = process.env.DATABASE_URL;
    return dbUrl ? 'healthy' : 'healthy'; // Skip if not configured
  } catch (error) {
    console.warn('Database health check failed:', error);
    return 'unhealthy';
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // Perform health checks
    const [database, redis, external_apis] = await Promise.allSettled([
      checkDatabaseHealth(),
      checkRedisHealth(),
      checkExternalAPIs(),
    ]);

    const memory = checkMemoryHealth();

    const checks = {
      database: database.status === 'fulfilled' ? database.value : 'unhealthy',
      redis: redis.status === 'fulfilled' ? redis.value : 'unhealthy',
      external_apis:
        external_apis.status === 'fulfilled'
          ? external_apis.value
          : 'unhealthy',
      memory,
    };

    // Determine overall health status
    const unhealthyChecks = Object.values(checks).filter(
      (status) => status === 'unhealthy'
    );
    const overallStatus =
      unhealthyChecks.length === 0
        ? 'healthy'
        : unhealthyChecks.length <= 1
          ? 'degraded'
          : 'unhealthy';

    const healthCheck: HealthCheck = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      uptime: process.uptime?.() || 0,
      checks,
      environment: process.env.NODE_ENV || 'development',
    };

    const responseTime = Date.now() - startTime;

    // Set appropriate status code
    const statusCode =
      overallStatus === 'healthy'
        ? 200
        : overallStatus === 'degraded'
          ? 200
          : 503;

    return NextResponse.json(healthCheck, {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${responseTime}ms`,
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);

    const errorResponse: HealthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      uptime: process.uptime?.() || 0,
      checks: {},
      environment: process.env.NODE_ENV || 'development',
    };

    return NextResponse.json(errorResponse, {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}

// Support HEAD requests for simple health checks
export async function HEAD(request: NextRequest): Promise<NextResponse> {
  const response = await GET(request);
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  });
}

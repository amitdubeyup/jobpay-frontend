/**
 * Unit Tests for Health Check API
 */

import { GET, HEAD } from '@/app/api/health/route';
import { NextRequest } from 'next/server';

// Mock process.uptime
jest.mock('process', () => ({
  ...jest.requireActual('process'),
  uptime: jest.fn(() => 3600), // 1 hour uptime
}));

// Mock fetch for external API checks
global.fetch = jest.fn();

describe('/api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
    });
  });

  describe('GET /api/health', () => {
    it('should return healthy status when all checks pass', async () => {
      const request = new NextRequest('http://localhost:3000/api/health');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.timestamp).toBeDefined();
      expect(data.version).toBeDefined();
      expect(typeof data.uptime).toBe('number');
      expect(data.uptime).toBeGreaterThan(0);
      expect(data.environment).toBe('test');
      expect(data.checks).toHaveProperty('memory');
      expect(data.checks).toHaveProperty('database');
      expect(data.checks).toHaveProperty('redis');
      expect(data.checks).toHaveProperty('external_apis');
    });

    it('should return degraded status when some checks fail', async () => {
      // Mock external API failure
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const request = new NextRequest('http://localhost:3000/api/health');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('degraded');
      expect(data.checks.external_apis).toBe('unhealthy');
    });

    it('should include response time header', async () => {
      const request = new NextRequest('http://localhost:3000/api/health');
      const response = await GET(request);

      expect(response.headers.get('X-Response-Time')).toMatch(/\d+ms/);
    });

    it('should have cache control headers', async () => {
      const request = new NextRequest('http://localhost:3000/api/health');
      const response = await GET(request);

      expect(response.headers.get('Cache-Control')).toBe(
        'no-cache, no-store, must-revalidate'
      );
    });
  });

  describe('HEAD /api/health', () => {
    it('should return same status code as GET but without body', async () => {
      const request = new NextRequest('http://localhost:3000/api/health');
      const response = await HEAD(request);

      expect(response.status).toBe(200);
      expect(response.body).toBeNull();
    });
  });
});

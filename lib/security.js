/**
 * Security Configuration for Next.js
 * Implements CSP, security headers, and other security measures
 */

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // SECURITY: Removed 'unsafe-eval' - only keep 'unsafe-inline' for Next.js compatibility
      // For stricter CSP, consider using nonce-based approach in production
      "script-src 'self' 'unsafe-inline' https://vercel.live https://js.sentry-cdn.com",
      // Note: 'unsafe-inline' for styles is required for many CSS-in-JS solutions
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // SECURITY: Restricted img-src to specific domains instead of wildcard https:
      "img-src 'self' blob: data: https://*.jobpay.com https://*.jobpay.in https://avatars.githubusercontent.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.sentry.io https://api.jobpay.com https://*.jobpay.in wss://*.jobpay.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

module.exports = { securityHeaders };

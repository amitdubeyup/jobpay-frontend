/**
 * Environment Configuration and Validation
 * Validates environment variables and provides type-safe access
 */

import { z } from 'zod';

// Environment schema validation with comprehensive checks
const envSchema = z.object({
  // Application
  NODE_ENV: z
    .enum(['development', 'production', 'test', 'staging'])
    .default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('JobPay'),

  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_GRAPHQL_ENDPOINT: z.string().url().optional(),
  API_SECRET_KEY: z.string().optional(),

  // Authentication (Required in production)
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters')
    .optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Database
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),

  // Analytics & Monitoring
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),

  // External Services
  STRIPE_PUBLIC_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  NEXT_PUBLIC_ENABLE_PWA: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  NEXT_PUBLIC_ENABLE_DEVTOOLS: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  NEXT_PUBLIC_FEATURE_PAYMENTS: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  NEXT_PUBLIC_FEATURE_CHAT: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
});

// Validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Environment validation failed');
  }
}

// Export validated environment
export const env = validateEnv();

// Environment helpers
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
export const isStaging = env.NODE_ENV === 'staging';

// Feature flags based on environment
export const features = {
  analytics: isProduction && !!env.NEXT_PUBLIC_GA_ID,
  errorMonitoring: isProduction && !!env.SENTRY_DSN,
  authentication: !!env.NEXTAUTH_SECRET,
  payments: !!env.STRIPE_PUBLIC_KEY,
  fileUpload: !!env.AWS_S3_BUCKET,
  emailService: !!env.SENDGRID_API_KEY,
  devTools: isDevelopment,
} as const;

// Configuration object
export const config = {
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    url: env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    environment: env.NODE_ENV,
  },
  api: {
    baseUrl: env.NEXT_PUBLIC_API_URL || '/api',
    graphqlEndpoint: env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '/api/graphql',
    timeout: 10000,
  },
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
    providers: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
  },
  database: {
    url: env.DATABASE_URL,
    redis: env.REDIS_URL,
  },
  analytics: {
    googleId: env.NEXT_PUBLIC_GA_ID,
  },
  monitoring: {
    sentry: {
      dsn: env.SENTRY_DSN,
      org: env.SENTRY_ORG,
      project: env.SENTRY_PROJECT,
    },
  },
  services: {
    stripe: {
      // Only expose public key to client - secret key should NEVER be in frontend
      publicKey: env.STRIPE_PUBLIC_KEY,
      // secretKey removed for security - use server-side API routes instead
    },
    // Removed: sendgrid.apiKey - server-side only, use API routes
    // Removed: aws credentials - server-side only, use API routes
    aws: {
      region: env.AWS_REGION || 'us-east-1',
      s3Bucket: env.AWS_S3_BUCKET,
      // accessKeyId and secretAccessKey removed - use server-side API routes
    },
  },
} as const;

// SECURITY NOTE: The following secrets should ONLY be used in server-side code
// (API routes, server actions) and should NEVER be exposed to the client:
// - STRIPE_SECRET_KEY
// - SENDGRID_API_KEY
// - AWS_ACCESS_KEY_ID
// - AWS_SECRET_ACCESS_KEY
// - DATABASE_URL
// - REDIS_URL
// Access these directly via process.env in server-side code only.

// Runtime configuration checks
export function checkRequiredConfig() {
  const errors: string[] = [];

  if (isProduction) {
    // Required in production
    if (!env.NEXT_PUBLIC_APP_URL) {
      errors.push('NEXT_PUBLIC_APP_URL is required in production');
    }

    if (!env.NEXTAUTH_SECRET) {
      errors.push('NEXTAUTH_SECRET is required in production');
    }

    // Sentry configuration check
    if (!env.SENTRY_DSN && process.env.ENABLE_ERROR_MONITORING === 'true') {
      errors.push('SENTRY_DSN is required when error monitoring is enabled');
    }

    // Database configuration check
    if (!env.DATABASE_URL && !env.REDIS_URL) {
      console.warn(
        '⚠️  No database configuration found. Some features may not work properly.'
      );
    }
  }

  if (isStaging) {
    // Required in staging
    if (!env.NEXT_PUBLIC_APP_URL) {
      errors.push('NEXT_PUBLIC_APP_URL is required in staging');
    }
  }

  // API configuration check
  if (!env.NEXT_PUBLIC_API_URL && !env.NEXT_PUBLIC_GRAPHQL_ENDPOINT) {
    console.warn(
      '⚠️  No API configuration found. Application may not function properly.'
    );
  }

  // Authentication provider checks
  if (env.GOOGLE_CLIENT_ID && !env.GOOGLE_CLIENT_SECRET) {
    errors.push(
      'GOOGLE_CLIENT_SECRET is required when GOOGLE_CLIENT_ID is set'
    );
  }

  // Payment configuration checks
  if (env.STRIPE_PUBLIC_KEY && !env.STRIPE_SECRET_KEY) {
    errors.push('STRIPE_SECRET_KEY is required when STRIPE_PUBLIC_KEY is set');
  }

  // AWS configuration checks
  if (
    env.AWS_ACCESS_KEY_ID &&
    (!env.AWS_SECRET_ACCESS_KEY || !env.AWS_S3_BUCKET)
  ) {
    errors.push(
      'AWS_SECRET_ACCESS_KEY and AWS_S3_BUCKET are required when AWS_ACCESS_KEY_ID is set'
    );
  }

  if (errors.length > 0) {
    console.error('❌ Configuration errors:', errors);

    if (isProduction) {
      throw new Error(
        `Production configuration validation failed: ${errors.join(', ')}`
      );
    } else {
      console.warn('⚠️  Configuration warnings (non-production):', errors);
    }
  }

  console.log('✅ Configuration validated successfully');
}

// Validate configuration on module load
if (typeof window === 'undefined') {
  // Only validate on server-side to avoid client-side errors
  try {
    checkRequiredConfig();
  } catch (error) {
    if (isProduction) {
      throw error;
    } else {
      console.warn('Configuration validation failed:', error);
    }
  }
}

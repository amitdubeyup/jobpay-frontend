/**
 * Environment Configuration and Validation
 * Validates environment variables and provides type-safe access
 */

import { z } from 'zod';

// Environment schema validation
const envSchema = z.object({
  // Application
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('JobPay'),

  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_GRAPHQL_ENDPOINT: z.string().url().optional(),
  API_SECRET_KEY: z.string().optional(),

  // Authentication
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Database
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),

  // Analytics & Monitoring
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
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
      publicKey: env.STRIPE_PUBLIC_KEY,
      secretKey: env.STRIPE_SECRET_KEY,
    },
    sendgrid: {
      apiKey: env.SENDGRID_API_KEY,
    },
    aws: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION || 'us-east-1',
      s3Bucket: env.AWS_S3_BUCKET,
    },
  },
} as const;

// Runtime configuration checks
export function checkRequiredConfig() {
  const errors: string[] = [];

  if (isProduction) {
    if (!env.NEXT_PUBLIC_APP_URL) {
      errors.push('NEXT_PUBLIC_APP_URL is required in production');
    }

    if (!env.NEXTAUTH_SECRET) {
      errors.push('NEXTAUTH_SECRET is required in production');
    }
  }

  if (errors.length > 0) {
    console.error('❌ Configuration errors:', errors);
    throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
  }

  console.log('✅ Configuration validated successfully');
}

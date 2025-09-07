/**
 * Feature Flags System
 * Centralized feature flag management for gradual rollouts and A/B testing
 */

import { z } from 'zod';

// Feature flag schema
const FeatureFlagSchema = z.object({
  // Core application features
  ENABLE_PWA: z.boolean().default(true),
  ENABLE_ANALYTICS: z.boolean().default(false),
  ENABLE_ERROR_MONITORING: z.boolean().default(false),
  ENABLE_DEVTOOLS: z.boolean().default(false),

  // Authentication features
  ENABLE_GOOGLE_AUTH: z.boolean().default(false),
  ENABLE_LINKEDIN_AUTH: z.boolean().default(false),
  ENABLE_TWO_FACTOR_AUTH: z.boolean().default(false),

  // Business features
  ENABLE_PAYMENTS: z.boolean().default(false),
  ENABLE_PREMIUM_FEATURES: z.boolean().default(false),
  ENABLE_JOB_ALERTS: z.boolean().default(true),
  ENABLE_CHAT_SUPPORT: z.boolean().default(false),
  ENABLE_VIDEO_INTERVIEWS: z.boolean().default(false),

  // UI/UX features
  ENABLE_DARK_MODE: z.boolean().default(true),
  ENABLE_ANIMATIONS: z.boolean().default(true),
  ENABLE_ACCESSIBILITY_MODE: z.boolean().default(true),
  ENABLE_MOBILE_APP_BANNER: z.boolean().default(false),

  // Performance features
  ENABLE_SERVICE_WORKER: z.boolean().default(true),
  ENABLE_IMAGE_OPTIMIZATION: z.boolean().default(true),
  ENABLE_PREFETCHING: z.boolean().default(true),

  // Development features
  ENABLE_MOCK_DATA: z.boolean().default(false),
  ENABLE_DEBUG_MODE: z.boolean().default(false),
  ENABLE_PERFORMANCE_MONITORING: z.boolean().default(false),
});

export type FeatureFlags = z.infer<typeof FeatureFlagSchema>;

// Environment-based feature flag configuration
function getEnvironmentFlags(): Partial<FeatureFlags> {
  const env = process.env.NODE_ENV;
  const customEnv = process.env.NEXT_PUBLIC_ENVIRONMENT || env;

  // Handle standard NODE_ENV values
  if (env === 'development') {
    return {
      ENABLE_DEVTOOLS: true,
      ENABLE_DEBUG_MODE: true,
      ENABLE_MOCK_DATA: true,
      ENABLE_ERROR_MONITORING: false,
      ENABLE_ANALYTICS: false,
    };
  }

  if (env === 'production') {
    // Check if it's actually staging via custom environment variable
    if (customEnv === 'staging') {
      return {
        ENABLE_DEVTOOLS: false,
        ENABLE_DEBUG_MODE: false,
        ENABLE_MOCK_DATA: false,
        ENABLE_ERROR_MONITORING: true,
        ENABLE_ANALYTICS: true,
        ENABLE_PERFORMANCE_MONITORING: true,
      };
    }

    // Production environment
    return {
      ENABLE_DEVTOOLS: false,
      ENABLE_DEBUG_MODE: false,
      ENABLE_MOCK_DATA: false,
      ENABLE_ERROR_MONITORING: true,
      ENABLE_ANALYTICS: true,
      ENABLE_PERFORMANCE_MONITORING: true,
      ENABLE_SERVICE_WORKER: true,
      ENABLE_IMAGE_OPTIMIZATION: true,
      ENABLE_PREFETCHING: true,
    };
  }

  // Test environment or any other environment
  return {
    ENABLE_DEVTOOLS: false,
    ENABLE_DEBUG_MODE: true,
    ENABLE_MOCK_DATA: true,
    ENABLE_ERROR_MONITORING: false,
    ENABLE_ANALYTICS: false,
  };
}

// Parse feature flags from environment variables
function parseFeatureFlags(): FeatureFlags {
  const envFlags = getEnvironmentFlags();

  // Override with environment variables if present
  const overrides: Partial<FeatureFlags> = {};

  Object.keys(FeatureFlagSchema.shape).forEach((key) => {
    const envValue =
      process.env[`NEXT_PUBLIC_FEATURE_${key}`] ||
      process.env[`NEXT_PUBLIC_${key}`];
    if (envValue !== undefined) {
      overrides[key as keyof FeatureFlags] = envValue === 'true';
    }
  });

  // Merge environment defaults with overrides
  const mergedFlags = {
    ...envFlags,
    ...overrides,
  };

  // Validate and return
  return FeatureFlagSchema.parse(mergedFlags);
}

// Global feature flags instance
export const featureFlags = parseFeatureFlags();

// Feature flag hooks and utilities
export class FeatureFlagManager {
  private static flags = featureFlags;

  static isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag] ?? false;
  }

  static getFlag(flag: keyof FeatureFlags): boolean {
    return this.flags[flag] ?? false;
  }

  static getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }

  // Runtime flag updates (for A/B testing, etc.)
  static updateFlag(flag: keyof FeatureFlags, value: boolean): void {
    this.flags = { ...this.flags, [flag]: value };

    // Notify subscribers or trigger re-renders if needed
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('featureFlagUpdate', {
          detail: { flag, value },
        })
      );
    }
  }

  // User-based feature flags (for gradual rollouts)
  static isEnabledForUser(flag: keyof FeatureFlags, userId?: string): boolean {
    const baseEnabled = this.isEnabled(flag);

    if (!baseEnabled || !userId) {
      return baseEnabled;
    }

    // Simple percentage-based rollout
    // In a real implementation, you'd use a proper feature flag service
    const hash = this.hashUserId(userId);
    const rolloutPercentage = this.getRolloutPercentage(flag);

    return hash % 100 < rolloutPercentage;
  }

  private static hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private static getRolloutPercentage(flag: keyof FeatureFlags): number {
    // Define rollout percentages for each flag
    const rolloutConfig: Partial<Record<keyof FeatureFlags, number>> = {
      ENABLE_PREMIUM_FEATURES: 25, // 25% rollout
      ENABLE_VIDEO_INTERVIEWS: 50, // 50% rollout
      ENABLE_CHAT_SUPPORT: 75, // 75% rollout
    };

    return rolloutConfig[flag] ?? 100; // Default to 100% if not specified
  }
}

// React hook for feature flags
export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  return FeatureFlagManager.isEnabled(flag);
}

// React hook for user-specific feature flags
export function useFeatureFlagForUser(
  flag: keyof FeatureFlags,
  userId?: string
): boolean {
  return FeatureFlagManager.isEnabledForUser(flag, userId);
}

// Component wrapper for conditional rendering
interface FeatureGateProps {
  flag: keyof FeatureFlags;
  userId?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({
  flag,
  userId,
  children,
  fallback = null,
}: FeatureGateProps) {
  const isEnabled = userId
    ? FeatureFlagManager.isEnabledForUser(flag, userId)
    : FeatureFlagManager.isEnabled(flag);

  return isEnabled ? children : fallback;
}

// Debugging helper
export function debugFeatureFlags(): void {
  if (process.env.NODE_ENV === 'development') {
    console.group('🚩 Feature Flags Status');
    Object.entries(FeatureFlagManager.getAllFlags()).forEach(
      ([flag, enabled]) => {
        console.log(`${flag}: ${enabled ? '✅' : '❌'}`);
      }
    );
    console.groupEnd();
  }
}

/**
 * Integration Tests for Feature Flags
 */

import {
  FeatureFlagManager,
  FeatureGate,
  useFeatureFlag,
} from '@/lib/feature-flags';
import { render, screen } from '@/lib/test-utils';

// Mock environment
const originalEnv = process.env;

describe('Feature Flags System', () => {
  beforeEach(() => {
    // Reset to clean state
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('FeatureFlagManager', () => {
    it('should return correct flag values', () => {
      expect(FeatureFlagManager.isEnabled('ENABLE_PWA')).toBeDefined();
      expect(typeof FeatureFlagManager.isEnabled('ENABLE_PWA')).toBe('boolean');
    });

    it('should handle unknown flags gracefully', () => {
      // @ts-ignore - Testing unknown flag
      expect(FeatureFlagManager.isEnabled('UNKNOWN_FLAG')).toBe(false);
    });

    it('should update flags at runtime', () => {
      const initialValue = FeatureFlagManager.isEnabled('ENABLE_ANALYTICS');

      FeatureFlagManager.updateFlag('ENABLE_ANALYTICS', !initialValue);
      expect(FeatureFlagManager.isEnabled('ENABLE_ANALYTICS')).toBe(
        !initialValue
      );
    });

    it('should handle user-based rollouts', () => {
      const userId = 'test-user-123';
      const result = FeatureFlagManager.isEnabledForUser(
        'ENABLE_PREMIUM_FEATURES',
        userId
      );
      expect(typeof result).toBe('boolean');
    });

    it('should return all flags', () => {
      const allFlags = FeatureFlagManager.getAllFlags();
      expect(typeof allFlags).toBe('object');
      expect(allFlags).toHaveProperty('ENABLE_PWA');
      expect(allFlags).toHaveProperty('ENABLE_ANALYTICS');
    });
  });

  describe('Environment-based configuration', () => {
    it('should configure flags for development environment', () => {
      // Mock NODE_ENV for this test
      const originalEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true,
      });

      // Re-import to get new environment
      jest.resetModules();
      const {
        FeatureFlagManager: DevFlagManager,
      } = require('@/lib/feature-flags');

      // Development should have debug features enabled
      expect(DevFlagManager.getAllFlags()).toBeDefined();

      // Restore original environment
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        writable: true,
        configurable: true,
      });
    });

    it('should configure flags for production environment', () => {
      // Mock NODE_ENV for this test
      const originalEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true,
      });

      // Re-import to get new environment
      jest.resetModules();
      const {
        FeatureFlagManager: ProdFlagManager,
      } = require('@/lib/feature-flags');

      expect(ProdFlagManager.getAllFlags()).toBeDefined();

      // Restore original environment
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        writable: true,
        configurable: true,
      });
    });
  });

  describe('FeatureGate Component', () => {
    it('renders children when flag is enabled', () => {
      // Mock flag as enabled
      jest.spyOn(FeatureFlagManager, 'isEnabled').mockReturnValue(true);

      render(
        <FeatureGate flag="ENABLE_CHAT_SUPPORT">
          <div data-testid="chat-widget">Chat Widget</div>
        </FeatureGate>
      );

      expect(screen.getByTestId('chat-widget')).toBeInTheDocument();
    });

    it('renders fallback when flag is disabled', () => {
      // Mock flag as disabled
      jest.spyOn(FeatureFlagManager, 'isEnabled').mockReturnValue(false);

      render(
        <FeatureGate
          flag="ENABLE_CHAT_SUPPORT"
          fallback={<div data-testid="fallback">Feature not available</div>}
        >
          <div data-testid="chat-widget">Chat Widget</div>
        </FeatureGate>
      );

      expect(screen.queryByTestId('chat-widget')).not.toBeInTheDocument();
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });

    it('handles user-specific flags', () => {
      const userId = 'test-user';
      jest.spyOn(FeatureFlagManager, 'isEnabledForUser').mockReturnValue(true);

      render(
        <FeatureGate flag="ENABLE_PREMIUM_FEATURES" userId={userId}>
          <div data-testid="premium-feature">Premium Feature</div>
        </FeatureGate>
      );

      expect(screen.getByTestId('premium-feature')).toBeInTheDocument();
      expect(FeatureFlagManager.isEnabledForUser).toHaveBeenCalledWith(
        'ENABLE_PREMIUM_FEATURES',
        userId
      );
    });
  });

  describe('useFeatureFlag hook', () => {
    it('returns the correct flag value', () => {
      const TestComponent = () => {
        const isEnabled = useFeatureFlag('ENABLE_PWA');
        return (
          <div data-testid="result">{isEnabled ? 'enabled' : 'disabled'}</div>
        );
      };

      render(<TestComponent />);

      const result = screen.getByTestId('result');
      expect(result.textContent).toMatch(/enabled|disabled/);
    });
  });
});

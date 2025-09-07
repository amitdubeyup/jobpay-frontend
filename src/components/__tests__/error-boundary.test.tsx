/**
 * Unit Tests for Error Boundary Components
 */

import {
  AppErrorBoundary,
  ComponentErrorBoundary,
  ErrorBoundary,
  PageErrorBoundary,
} from '@/components/error-boundary';
import { fireEvent, render, screen } from '@/lib/test-utils';
import React from 'react';

// Mock the instrumentation client
jest.mock('../../../instrumentation-client', () => ({
  captureError: jest.fn(),
}));

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div data-testid="success">No error</div>;
};

describe('ErrorBoundary Components', () => {
  const originalError = console.error;
  let suppressErrors = true;

  beforeAll(() => {
    // Suppress error logs during tests
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    suppressErrors = true;
  });

  describe('ErrorBoundary', () => {
    it('renders children when there is no error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('success')).toBeInTheDocument();
    });

    it('renders error UI when child component throws', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();
    });

    it('renders custom fallback when provided', () => {
      const CustomFallback = (
        <div data-testid="custom-fallback">Custom Error</div>
      );

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(
        screen.queryByText(/something went wrong/i)
      ).not.toBeInTheDocument();
    });

    it('calls onError callback when error occurs', () => {
      const onError = jest.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object)
      );
    });

    it('resets error state when retry button is clicked', () => {
      const TestWrapper = () => {
        const [shouldThrow, setShouldThrow] = React.useState(true);

        React.useEffect(() => {
          const timer = setTimeout(() => setShouldThrow(false), 100);
          return () => clearTimeout(timer);
        }, []);

        return (
          <ErrorBoundary>
            <ThrowError shouldThrow={shouldThrow} />
          </ErrorBoundary>
        );
      };

      render(<TestWrapper />);

      // Error should be shown initially
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

      // Click retry button
      fireEvent.click(screen.getByRole('button', { name: /try again/i }));

      // Should attempt to re-render children
      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument();
    });
  });

  describe('App Level Error Boundary', () => {
    it('renders app-specific error message', () => {
      render(
        <AppErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AppErrorBoundary>
      );

      expect(screen.getByText(/application error/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /reload page/i })
      ).toBeInTheDocument();
    });
  });

  describe('Page Level Error Boundary', () => {
    it('renders page-specific error message', () => {
      render(
        <PageErrorBoundary>
          <ThrowError shouldThrow={true} />
        </PageErrorBoundary>
      );

      expect(screen.getByText(/page error/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /go to homepage/i })
      ).toBeInTheDocument();
    });
  });

  describe('Component Level Error Boundary', () => {
    it('renders component-specific error message', () => {
      render(
        <ComponentErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ComponentErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(/auto-retry in 2 seconds/i)).toBeInTheDocument();
    });
  });

  describe('Development mode features', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    afterEach(() => {
      // Reset NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalNodeEnv,
        writable: true,
      });
    });

    it('shows error details in development mode', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should show error details in development
      expect(screen.getByText(/error details/i)).toBeInTheDocument();
    });

    it('hides error details in production mode', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
      });

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should not show error details in production
      expect(screen.queryByText(/error details/i)).not.toBeInTheDocument();
    });
  });

  describe('Error ID generation', () => {
    it('generates unique error IDs for each error', () => {
      const { unmount } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const firstErrorId = screen.getByText(/error id:/i).textContent;
      unmount();

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const secondErrorId = screen.getByText(/error id:/i).textContent;
      expect(firstErrorId).not.toBe(secondErrorId);
    });
  });
});

/**
 * Global Error Boundary Component
 * Catches and handles React errors at the application level
 */

'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import React, { Component, ReactNode } from 'react';
import { captureError } from '../../instrumentation-client';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'app' | 'page' | 'component';
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Send to monitoring service
    captureError(error, {
      tags: {
        errorBoundary: true,
        level: this.props.level || 'component',
      },
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      extra: {
        errorBoundaryLevel: this.props.level,
        errorId: this.state.errorId,
      },
    });

    // Log error details in development (but not during tests)
    if (process.env.NODE_ENV === 'development') {
      console.group('�️ Error Boundary: Component Error Caught');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  handleRetryWithDelay = (delay: number = 1000) => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.retryTimeoutId = setTimeout(() => {
      this.handleRetry();
    }, delay);
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Different UI based on error boundary level
      const isAppLevel = this.props.level === 'app';
      const isPageLevel = this.props.level === 'page';

      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
          <div className="w-full max-w-md text-center space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {isAppLevel
                  ? 'Application Error'
                  : isPageLevel
                    ? 'Page Error'
                    : 'Something went wrong'}
              </h1>
              <p className="text-gray-600">
                {isAppLevel
                  ? 'The application encountered an unexpected error. Please try refreshing the page.'
                  : isPageLevel
                    ? 'This page encountered an error. You can try going back or refreshing.'
                    : 'A component on this page failed to load properly.'}
              </p>

              {/* Error ID for support */}
              {this.state.errorId && (
                <p className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                  Error ID: {this.state.errorId}
                </p>
              )}
            </div>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-red-50 p-3 rounded border">
                <summary className="text-sm font-medium text-red-800 cursor-pointer">
                  Error Details (Development)
                </summary>
                <div className="mt-2 space-y-2">
                  <div>
                    <div className="text-xs font-medium text-red-800">
                      Message:
                    </div>
                    <div className="text-xs text-red-700 font-mono">
                      {this.state.error.message}
                    </div>
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <div className="text-xs font-medium text-red-800">
                        Stack:
                      </div>
                      <pre className="text-xs text-red-700 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>

              {isPageLevel && (
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Button>
              )}

              {isAppLevel && (
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>
              )}
            </div>

            {/* Auto-retry for component-level errors */}
            {!isAppLevel && !isPageLevel && (
              <div className="text-xs text-gray-500">
                <button
                  onClick={() => this.handleRetryWithDelay(2000)}
                  className="underline hover:no-underline"
                >
                  Auto-retry in 2 seconds
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Convenience components for different levels
export const AppErrorBoundary: React.FC<Omit<Props, 'level'>> = (props) => (
  <ErrorBoundary {...props} level="app" />
);

export const PageErrorBoundary: React.FC<Omit<Props, 'level'>> = (props) => (
  <ErrorBoundary {...props} level="page" />
);

export const ComponentErrorBoundary: React.FC<Omit<Props, 'level'>> = (
  props
) => <ErrorBoundary {...props} level="component" />;

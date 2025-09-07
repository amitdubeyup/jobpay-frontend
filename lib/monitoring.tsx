/**
 * Error Monitoring and Logging Configuration
 * Implements error boundaries, logging, and performance monitoring
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Error boundary component
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // You can integrate with error monitoring services here
    // Example: Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              We apologize for the inconvenience. Please try refreshing the
              page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Custom error logger
export const errorLogger = {
  log: (error: Error, context: Record<string, any> = {}) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application Error:', error, context);
    }

    // You can integrate with error monitoring services here
    // Example: Send to Sentry, LogRocket, etc.
  },

  info: (message: string, data: Record<string, any> = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(message, data);
    }
  },

  warn: (message: string, data: Record<string, any> = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message, data);
    }
  },
};

// Performance monitoring
export const performanceMonitor = {
  markStart: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-start`);
    }
  },

  markEnd: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-end`);
      window.performance.measure(name, `${name}-start`, `${name}-end`);

      const measure = window.performance.getEntriesByName(name)[0];
      if (measure) {
        console.log(`Performance: ${name} took ${measure.duration}ms`);

        // Send to analytics if duration is concerning
        if (measure.duration > 1000) {
          errorLogger.warn(`Slow operation detected: ${name}`, {
            duration: measure.duration,
            name,
          });
        }
      }
    }
  },
};

// Analytics helper
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const analytics = {
  track: (event: string, properties: Record<string, any> = {}) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, properties);
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event, properties);
    }
  },

  page: (path: string) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: path,
      });
    }
  },
};

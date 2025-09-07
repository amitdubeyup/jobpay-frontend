'use client';

import { useEffect } from 'react';
import { initCrossBrowserOptimizations } from '../../lib/cross-browser';

/**
 * Cross-browser compatibility provider
 * Initializes polyfills and optimizations for all browsers
 */
export function CrossBrowserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize cross-browser optimizations
    initCrossBrowserOptimizations().catch((error: Error) => {
      console.warn('Failed to initialize cross-browser optimizations:', error);
    });
  }, []);

  return <>{children}</>;
}

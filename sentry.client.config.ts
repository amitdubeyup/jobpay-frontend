/**
 * MINIMAL Sentry Setup - Everything in one place!
 * To disable: Set NEXT_PUBLIC_SENTRY_DSN=""
 * To remove: Delete this file + remove @sentry/nextjs from package.json
 */

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Only initialize if DSN is provided
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    debug: !IS_PRODUCTION,
    tracesSampleRate: IS_PRODUCTION ? 0.1 : 1.0,

    // Session replay only in production
    ...(IS_PRODUCTION && {
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      integrations: [
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
    }),

    beforeSend(event) {
      if (!IS_PRODUCTION) {
        console.log('Sentry Event (Dev):', event);
        return null;
      }
      return event;
    },
  });
}

// Simple utilities (only if Sentry is enabled)
export const captureError = (error: Error, context?: any) => {
  if (SENTRY_DSN) {
    Sentry.captureException(error, context);
  }
};

export const setUser = (user: { id: string; [key: string]: any }) => {
  if (SENTRY_DSN) {
    Sentry.setUser(user);
  }
};

export const addBreadcrumb = (message: string, data?: any) => {
  if (SENTRY_DSN) {
    Sentry.addBreadcrumb({ message, data });
  }
};

export const sentry = SENTRY_DSN ? Sentry : null;

import * as Sentry from '@sentry/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Add request context to Sentry
  Sentry.setTag('route', request.nextUrl.pathname);
  Sentry.setContext('request', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    userAgent: request.headers.get('user-agent'),
  });

  // Add breadcrumb for request tracking
  Sentry.addBreadcrumb({
    message: `${request.method} ${request.nextUrl.pathname}`,
    category: 'http.request',
    level: 'info',
    data: {
      url: request.url,
      method: request.method,
    },
  });

  try {
    const response = NextResponse.next();

    // Add response context
    Sentry.setContext('response', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    });

    // Add success breadcrumb
    Sentry.addBreadcrumb({
      message: `Response: ${response.status}`,
      category: 'http.response',
      level: 'info',
      data: {
        status: response.status,
      },
    });

    return response;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        middleware: true,
        route: request.nextUrl.pathname,
      },
    });

    throw error;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - monitoring (Sentry tunnel)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|monitoring).*)',
  ],
};

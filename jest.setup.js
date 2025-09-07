// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

// Polyfill for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock Apollo Client
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useLazyQuery: jest.fn(),
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

// Mock Next.js Request and Response for API route testing
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init) {
      Object.defineProperty(this, 'url', {
        value: input,
        writable: false,
        configurable: true,
      });
      Object.defineProperty(this, 'method', {
        value: init?.method || 'GET',
        writable: false,
        configurable: true,
      });
      this.headers = new Headers(init?.headers || {});
      this.body = init?.body;
    }

    get(key) {
      return this.headers.get(key);
    }
  };
}

// Mock Headers if not available
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init) {
      this._headers = new Map();
      if (init) {
        if (Array.isArray(init)) {
          init.forEach(([key, value]) =>
            this._headers.set(key.toLowerCase(), value)
          );
        } else if (typeof init === 'object') {
          Object.entries(init).forEach(([key, value]) =>
            this._headers.set(key.toLowerCase(), value)
          );
        }
      }
    }

    get(key) {
      return this._headers.get(key.toLowerCase());
    }

    set(key, value) {
      this._headers.set(key.toLowerCase(), value);
    }

    has(key) {
      return this._headers.has(key.toLowerCase());
    }

    entries() {
      return this._headers.entries();
    }
  };
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
      this.statusText = init?.statusText || 'OK';
      this.headers = new Headers(init?.headers || {});
    }

    json() {
      return Promise.resolve(JSON.parse(this.body));
    }

    text() {
      return Promise.resolve(this.body);
    }

    static json(data, init) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
        },
      });
    }
  };
}

// Mock Next.js NextResponse
jest.mock('next/server', () => ({
  NextRequest: class NextRequest extends global.Request {
    constructor(input, init) {
      super(input, init);
    }
  },
  NextResponse: class NextResponse extends global.Response {
    constructor(body, init) {
      super(body, init);
    }

    static json(data, init) {
      return new NextResponse(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
        },
      });
    }

    static next() {
      return new NextResponse(null, { status: 200 });
    }
  },
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  group: jest.fn(),
  groupEnd: jest.fn(),
};

// Mock instrumentation client
jest.mock('./instrumentation-client', () => ({
  captureError: jest.fn(),
  setUser: jest.fn(),
  addBreadcrumb: jest.fn(),
  sentry: null,
}));

// Environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4000/api';
process.env.NODE_ENV = 'test';

// Handle expected errors from error boundary tests
const originalWindowError = window.onerror;
const originalUnhandledRejection = window.onunhandledrejection;

window.onerror = function (message, source, lineno, colno, error) {
  // If this looks like a test error from error boundary tests, ignore it
  if (error && error.message === 'Test error message') {
    return true; // Prevent the error from being logged
  }

  // Otherwise, let the original handler deal with it
  if (originalWindowError) {
    return originalWindowError.call(
      this,
      message,
      source,
      lineno,
      colno,
      error
    );
  }
  return false;
};

window.onunhandledrejection = function (event) {
  // If this looks like a test error from error boundary tests, ignore it
  if (event.reason && event.reason.message === 'Test error message') {
    event.preventDefault();
    return;
  }

  // Otherwise, let the original handler deal with it
  if (originalUnhandledRejection) {
    return originalUnhandledRejection.call(this, event);
  }
};

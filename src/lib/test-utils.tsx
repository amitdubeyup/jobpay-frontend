/**
 * Test Utilities
 * Provides common testing utilities and helpers
 */

import { MockedProvider } from '@apollo/client/testing';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { ReactElement } from 'react';

// Create a test-specific Query client
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  mocks?: any[];
}

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    mocks = [],
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
          </ThemeProvider>
        </MockedProvider>
      </QueryClientProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock data generators
export const mockJob = {
  id: 'job-1',
  title: 'Frontend Developer',
  company: 'Test Company',
  location: 'Remote',
  salary: '$80,000 - $100,000',
  jobType: 'full-time' as const,
  urgency: 'medium' as const,
  description: 'We are looking for a skilled frontend developer...',
  requirements: [
    'React experience',
    'TypeScript knowledge',
    'Problem-solving skills',
  ],
  benefits: ['Health insurance', 'Remote work', 'Flexible hours'],
  postedAt: '2024-01-15T10:00:00Z',
  applicationDeadline: '2024-02-15T23:59:59Z',
  status: 'open' as const,
};

export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user' as const,
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

// Mock API responses
export const mockApiResponse = function <T>(data: T, delay = 0) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiError = (
  message = 'API Error',
  status = 500,
  delay = 0
) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error = new Error(message);
      (error as any).status = status;
      reject(error);
    }, delay);
  });
};

// Helper to wait for async operations
export const waitFor = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Export everything including the custom render
export * from '@testing-library/react';
export { createTestQueryClient, customRender as render };

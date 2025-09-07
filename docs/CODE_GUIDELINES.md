# JobPay Frontend - Code Guidelines

## 🎯 **Overview**

This guide provides coding standards, patterns, and examples for building features in the JobPay Frontend. Follow these guidelines to ensure consistency, maintainability, and team collaboration.

## 📚 **Table of Contents**

- [Project Structure](#project-structure)
- [React Components](#react-components)
- [GraphQL with Apollo Client](#graphql-with-apollo-client)
- [React Query (TanStack Query)](#react-query-tanstack-query)
- [State Management](#state-management)
- [Type Safety with Zod](#type-safety-with-zod)
- [Forms and Validation](#forms-and-validation)
- [Styling Guidelines](#styling-guidelines)
- [Error Handling](#error-handling)
- [Authentication Patterns](#authentication-patterns)
- [Performance Optimization](#performance-optimization)
- [Testing Guidelines](#testing-guidelines)

---

## � **Frontend Code Guidelines**

Welcome to the JobPay Frontend development guidelines! This document provides comprehensive standards, patterns, and best practices for maintaining high-quality, enterprise-grade code.

## 🔄 **Development Workflow**

### **Branch Management & Git Flow**

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/job-search-filters

# 2. Make changes with proper commits
git add .
git commit -m "feat: add advanced job search filters with location and salary range"

# 3. Push and create Pull Request
git push origin feature/job-search-filters
# Open PR on GitHub with clear description and screenshots
```

### **Pull Request Process**

**PR Requirements:**

1. **Clear Title**: Use conventional commits format (`feat:`, `fix:`, `docs:`, etc.)
2. **Description**: Explain what changed, why, and how to test
3. **Screenshots/Videos**: For UI changes, include visual proof
4. **Test Results**: Show that tests pass and new features work
5. **Documentation**: Update relevant docs if needed

**Review Process:**

- All PRs require **at least one approval** from team lead or senior developer
- **Automated checks** must pass (tests, lint, build, security)
- **Manual testing** required for UI/UX changes
- **Address feedback** promptly and professionally

### **Commit Message Standards**

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# Feature additions
feat: add job application tracking dashboard
feat(ui): implement dark mode toggle with system preference

# Bug fixes
fix: resolve infinite loading state in job search
fix(auth): handle token refresh edge case

# Documentation
docs: update API integration guide
docs(readme): add Docker setup instructions

# Code maintenance
refactor: extract common GraphQL error handling
style: fix ESLint warnings in job components
perf: optimize job list rendering with virtualization

# Testing
test: add unit tests for job filter components
test(e2e): add integration tests for application flow
```

### **Testing Workflow**

**Before Each Commit:**

```bash
# Run full test suite
pnpm test

# Check for type errors
pnpm type-check

# Verify build works
pnpm build
```

**Test Development Approach:**

1. **Write tests for new features** as you develop them
2. **Test critical user paths** (auth, job search, applications)
3. **Mock external dependencies** (API calls, third-party services)
4. **Test error scenarios** (network failures, validation errors)

### **Code Review Guidelines**

**For Authors:**

- Keep PRs **small and focused** (< 400 lines when possible)
- **Self-review** your code before requesting review
- **Add context** in PR description and code comments
- **Test thoroughly** on different browsers and devices
- **Be responsive** to feedback and questions

**For Reviewers:**

- **Be constructive** and explain the "why" behind suggestions
- **Test the changes** locally when possible
- **Check for security issues** and performance implications
- **Verify tests** are comprehensive and meaningful
- **Approve quickly** when code meets standards

## 🏗️ **Project Structure & Architecture**

### **Folder Organization**

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Route groups for auth pages
│   ├── jobs/              # Job-related pages
│   └── profile/           # User profile pages
├── components/            # Reusable components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── forms/            # Form components
│   ├── layouts/          # Layout components
│   └── features/         # Feature-specific components
├── lib/                  # Core utilities
│   ├── apollo.ts         # GraphQL client setup
│   ├── auth.ts           # Authentication utilities
│   ├── config.ts         # Environment configuration
│   └── utils.ts          # General utilities
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── graphql/             # GraphQL queries and mutations
│   ├── queries/         # Query definitions
│   ├── mutations/       # Mutation definitions
│   └── fragments/       # Reusable fragments
└── schemas/             # Zod validation schemas
```

### **File Naming Conventions**

- **Components**: `PascalCase.tsx` (e.g., `JobCard.tsx`)
- **Hooks**: `camelCase.ts` with `use` prefix (e.g., `useJobSearch.ts`)
- **Utilities**: `camelCase.ts` (e.g., `formatDate.ts`)
- **Types**: `PascalCase.ts` or `camelCase.ts` (e.g., `Job.ts` or `jobTypes.ts`)
- **Constants**: `UPPER_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`)

---

## ⚛️ **React Components**

### **Component Structure Template**

```tsx
// components/features/JobCard.tsx
import { FC } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Job } from '@/types';

// Props interface with clear documentation
interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
}

// Main component with proper typing
export const JobCard: FC<JobCardProps> = ({
  job,
  onApply,
  className,
  variant = 'default',
}) => {
  // Event handlers
  const handleApply = () => {
    onApply?.(job.id);
  };

  // Conditional rendering logic
  const isUrgent = job.urgency === 'high';
  const cardVariant = variant === 'featured' ? 'elevated' : 'default';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={className}
    >
      <Card variant={cardVariant} className={isUrgent ? 'border-red-500' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {job.title}
            {isUrgent && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                Urgent
              </span>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{job.company}</p>
            <p className="text-sm">{job.location}</p>
            <p className="font-semibold text-green-600">{job.salary}</p>

            {variant !== 'compact' && (
              <p className="text-sm text-gray-700 line-clamp-2">
                {job.description}
              </p>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleApply}
              disabled={job.status === 'applied'}
              className="flex-1"
            >
              {job.status === 'applied' ? 'Applied' : 'Apply Now'}
            </Button>

            <Button variant="outline" size="sm">
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Export types for external use
export type { JobCardProps };
```

### **Custom Hooks Pattern**

```tsx
// hooks/useJobSearch.ts
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import { searchJobsQuery } from '@/graphql/queries';
import { JobSearchFilters, Job } from '@/types';

export const useJobSearch = () => {
  const [filters, setFilters] = useState<JobSearchFilters>({
    query: '',
    location: '',
    jobType: 'all',
    salaryRange: [0, 200000],
  });

  // Debounce search query for performance
  const debouncedQuery = useDebounce(filters.query, 300);

  // GraphQL query with React Query
  const {
    data: jobs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['jobs', 'search', debouncedQuery, filters],
    queryFn: () =>
      searchJobsQuery({
        query: debouncedQuery,
        filters: {
          location: filters.location,
          jobType: filters.jobType,
          salaryMin: filters.salaryRange[0],
          salaryMax: filters.salaryRange[1],
        },
      }),
    enabled: debouncedQuery.length > 2, // Only search with 3+ characters
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<JobSearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      query: '',
      location: '',
      jobType: 'all',
      salaryRange: [0, 200000],
    });
  }, []);

  return {
    jobs: jobs?.data || [],
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch,
    totalCount: jobs?.totalCount || 0,
  };
};
```

---

## 🚀 **GraphQL with Apollo Client**

### **Query Definition**

```tsx
// graphql/queries/jobQueries.ts
import { gql } from '@apollo/client';

// Fragment for reusable job fields
export const JOB_FRAGMENT = gql`
  fragment JobFields on Job {
    id
    title
    company
    location
    salary
    jobType
    urgency
    description
    requirements
    benefits
    postedAt
    applicationDeadline
    status
  }
`;

// Search jobs query
export const SEARCH_JOBS = gql`
  ${JOB_FRAGMENT}

  query SearchJobs(
    $query: String!
    $filters: JobSearchFilters
    $pagination: PaginationInput
  ) {
    searchJobs(query: $query, filters: $filters, pagination: $pagination) {
      data {
        ...JobFields
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
`;

// Get job by ID
export const GET_JOB = gql`
  ${JOB_FRAGMENT}

  query GetJob($id: ID!) {
    job(id: $id) {
      ...JobFields
      company {
        id
        name
        logo
        description
        website
      }
    }
  }
`;
```

### **Mutation Definition**

```tsx
// graphql/mutations/jobMutations.ts
import { gql } from '@apollo/client';

export const APPLY_TO_JOB = gql`
  mutation ApplyToJob($input: JobApplicationInput!) {
    applyToJob(input: $input) {
      id
      status
      appliedAt
      job {
        id
        title
        company
      }
      user {
        id
        name
        email
      }
    }
  }
`;

export const SAVE_JOB = gql`
  mutation SaveJob($jobId: ID!) {
    saveJob(jobId: $jobId) {
      id
      isSaved
    }
  }
`;
```

### **Using Queries and Mutations in Components**

```tsx
// components/features/JobDetail.tsx
import { FC } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { GET_JOB, APPLY_TO_JOB } from '@/graphql/queries';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';

interface JobDetailProps {
  jobId: string;
}

export const JobDetail: FC<JobDetailProps> = ({ jobId }) => {
  const router = useRouter();
  const { toast } = useToast();

  // Query for job details
  const { data, loading, error } = useQuery(GET_JOB, {
    variables: { id: jobId },
    errorPolicy: 'all',
  });

  // Mutation for job application
  const [applyToJob, { loading: applying }] = useMutation(APPLY_TO_JOB, {
    onCompleted: (data) => {
      toast({
        title: 'Application Submitted!',
        description: `Your application for ${data.applyToJob.job.title} has been submitted.`,
        variant: 'success',
      });
      router.push('/applications');
    },
    onError: (error) => {
      toast({
        title: 'Application Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
    // Update cache after successful application
    update: (cache, { data }) => {
      if (data?.applyToJob) {
        cache.modify({
          id: cache.identify({ __typename: 'Job', id: jobId }),
          fields: {
            status: () => 'applied',
          },
        });
      }
    },
  });

  const handleApply = () => {
    applyToJob({
      variables: {
        input: {
          jobId,
          coverLetter: '', // Could come from a form
          resumeId: 'user-resume-id',
        },
      },
    });
  };

  if (loading) return <JobDetailSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data?.job) return <NotFoundMessage />;

  const { job } = data;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
        <p className="text-xl text-gray-600">{job.company}</p>
        <p className="text-gray-500">{job.location}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
            <ul className="list-disc list-inside space-y-2">
              {job.requirements?.map((req: string, index: number) => (
                <li key={index} className="text-gray-700">
                  {req}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <Button
              onClick={handleApply}
              disabled={applying || job.status === 'applied'}
              className="w-full"
              size="lg"
            >
              {applying
                ? 'Applying...'
                : job.status === 'applied'
                  ? 'Applied'
                  : 'Apply Now'}
            </Button>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <span className="font-medium">Salary:</span>
                <span className="ml-2 text-green-600">{job.salary}</span>
              </div>
              <div>
                <span className="font-medium">Job Type:</span>
                <span className="ml-2">{job.jobType}</span>
              </div>
              <div>
                <span className="font-medium">Posted:</span>
                <span className="ml-2">{formatDate(job.postedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 🔄 **React Query (TanStack Query)**

### **Query Configuration**

```tsx
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### **Custom Query Hooks**

```tsx
// hooks/queries/useJobs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api';
import { Job, JobSearchFilters } from '@/types';

// Query keys factory
export const jobQueryKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobQueryKeys.all, 'list'] as const,
  list: (filters: JobSearchFilters) =>
    [...jobQueryKeys.lists(), filters] as const,
  details: () => [...jobQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobQueryKeys.details(), id] as const,
};

// Fetch jobs with filters
export const useJobs = (filters: JobSearchFilters) => {
  return useQuery({
    queryKey: jobQueryKeys.list(filters),
    queryFn: () => jobsApi.search(filters),
    enabled: !!filters.query || !!filters.location,
    keepPreviousData: true,
  });
};

// Fetch single job
export const useJob = (id: string) => {
  return useQuery({
    queryKey: jobQueryKeys.detail(id),
    queryFn: () => jobsApi.getById(id),
    enabled: !!id,
  });
};

// Apply to job mutation
export const useApplyToJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsApi.apply,
    onSuccess: (data, variables) => {
      // Update job status in cache
      queryClient.setQueryData(
        jobQueryKeys.detail(variables.jobId),
        (old: Job | undefined) => (old ? { ...old, status: 'applied' } : old)
      );

      // Invalidate related queries
      queryClient.invalidateQueries(jobQueryKeys.lists());
    },
  });
};

// Infinite query for job feed
export const useInfiniteJobs = (filters: JobSearchFilters) => {
  return useInfiniteQuery({
    queryKey: ['jobs', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      jobsApi.search({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    keepPreviousData: true,
  });
};
```

### **Optimistic Updates**

```tsx
// hooks/mutations/useSaveJob.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api';
import { jobQueryKeys } from '@/hooks/queries/useJobs';

export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsApi.toggleSave,
    // Optimistic update
    onMutate: async (jobId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(jobQueryKeys.detail(jobId));

      // Snapshot the previous value
      const previousJob = queryClient.getQueryData(jobQueryKeys.detail(jobId));

      // Optimistically update
      queryClient.setQueryData(jobQueryKeys.detail(jobId), (old: any) => ({
        ...old,
        isSaved: !old?.isSaved,
      }));

      return { previousJob };
    },
    // Rollback on error
    onError: (err, jobId, context) => {
      queryClient.setQueryData(
        jobQueryKeys.detail(jobId),
        context?.previousJob
      );
    },
    // Always refetch after error or success
    onSettled: (data, error, jobId) => {
      queryClient.invalidateQueries(jobQueryKeys.detail(jobId));
    },
  });
};
```

---

## 🛡️ **Type Safety with Zod**

### **Schema Definitions**

```tsx
// schemas/jobSchemas.ts
import { z } from 'zod';

// Base job schema
export const JobSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.string(),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  urgency: z.enum(['low', 'medium', 'high']).default('medium'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  postedAt: z.string().datetime(),
  applicationDeadline: z.string().datetime().optional(),
  status: z.enum(['open', 'applied', 'closed']).default('open'),
});

// Job search filters schema
export const JobSearchFiltersSchema = z.object({
  query: z.string().default(''),
  location: z.string().default(''),
  jobType: z
    .enum(['all', 'full-time', 'part-time', 'contract', 'internship'])
    .default('all'),
  salaryRange: z.tuple([z.number(), z.number()]).default([0, 200000]),
  experience: z.enum(['all', 'entry', 'mid', 'senior']).default('all'),
  remote: z.boolean().default(false),
});

// Job application schema
export const JobApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  coverLetter: z
    .string()
    .min(50, 'Cover letter must be at least 50 characters'),
  resumeId: z.string().min(1, 'Resume is required'),
  expectedSalary: z.number().positive().optional(),
  availableFrom: z.string().datetime().optional(),
});

// Type inference
export type Job = z.infer<typeof JobSchema>;
export type JobSearchFilters = z.infer<typeof JobSearchFiltersSchema>;
export type JobApplication = z.infer<typeof JobApplicationSchema>;
```

### **Environment Configuration with Zod**

```tsx
// lib/config.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NEXT_PUBLIC_API_URL: z.string().url('Invalid API URL'),
  NEXT_PUBLIC_SITE_URL: z.string().url('Invalid site URL'),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'Auth secret must be at least 32 characters'),
  DATABASE_URL: z.string().url('Invalid database URL').optional(),
  REDIS_URL: z.string().url('Invalid Redis URL').optional(),
});

// Validate environment variables
const env = envSchema.parse(process.env);

export const config = {
  env: env.NODE_ENV,
  api: {
    url: env.NEXT_PUBLIC_API_URL,
  },
  site: {
    url: env.NEXT_PUBLIC_SITE_URL,
  },
  auth: {
    secret: env.NEXTAUTH_SECRET,
  },
  database: {
    url: env.DATABASE_URL,
  },
  redis: {
    url: env.REDIS_URL,
  },
} as const;

export type Config = typeof config;
```

### **API Response Validation**

```tsx
// lib/api/jobsApi.ts
import { JobSchema, JobSearchFiltersSchema } from '@/schemas/jobSchemas';
import { z } from 'zod';

// API response schemas
const SearchJobsResponseSchema = z.object({
  data: z.array(JobSchema),
  totalCount: z.number(),
  page: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

class JobsAPI {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  async search(filters: JobSearchFilters) {
    // Validate input
    const validatedFilters = JobSearchFiltersSchema.parse(filters);

    const response = await fetch(`${this.baseUrl}/jobs/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFilters),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Validate response
    return SearchJobsResponseSchema.parse(data);
  }

  async getById(id: string) {
    const response = await fetch(`${this.baseUrl}/jobs/${id}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Validate single job response
    return JobSchema.parse(data);
  }
}

export const jobsApi = new JobsAPI();
```

---

## 📝 **Forms and Validation**

### **Form Component with React Hook Form + Zod**

```tsx
// components/forms/JobApplicationForm.tsx
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  JobApplicationSchema,
  type JobApplication,
} from '@/schemas/jobSchemas';
import { useApplyToJob } from '@/hooks/mutations/useApplyToJob';

interface JobApplicationFormProps {
  jobId: string;
  onSuccess?: () => void;
}

export const JobApplicationForm: FC<JobApplicationFormProps> = ({
  jobId,
  onSuccess,
}) => {
  const applyToJob = useApplyToJob();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JobApplication>({
    resolver: zodResolver(JobApplicationSchema),
    defaultValues: {
      jobId,
      coverLetter: '',
      resumeId: '',
    },
  });

  const onSubmit = async (data: JobApplication) => {
    try {
      await applyToJob.mutateAsync(data);
      reset();
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="coverLetter">Cover Letter *</Label>
        <Textarea
          id="coverLetter"
          {...register('coverLetter')}
          placeholder="Tell us why you're perfect for this role..."
          className="min-h-[120px]"
          error={errors.coverLetter?.message}
        />
      </div>

      <div>
        <Label htmlFor="resumeId">Resume *</Label>
        <Input
          id="resumeId"
          {...register('resumeId')}
          placeholder="Select your resume"
          error={errors.resumeId?.message}
        />
      </div>

      <div>
        <Label htmlFor="expectedSalary">Expected Salary (Optional)</Label>
        <Input
          id="expectedSalary"
          type="number"
          {...register('expectedSalary', { valueAsNumber: true })}
          placeholder="Enter your expected salary"
          error={errors.expectedSalary?.message}
        />
      </div>

      <div>
        <Label htmlFor="availableFrom">Available From (Optional)</Label>
        <Input
          id="availableFrom"
          type="datetime-local"
          {...register('availableFrom')}
          error={errors.availableFrom?.message}
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting || applyToJob.isLoading}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};
```

### **Search Form with Filters**

```tsx
// components/forms/JobSearchForm.tsx
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  JobSearchFiltersSchema,
  type JobSearchFilters,
} from '@/schemas/jobSchemas';

interface JobSearchFormProps {
  initialFilters?: Partial<JobSearchFilters>;
  onFiltersChange: (filters: JobSearchFilters) => void;
}

export const JobSearchForm: FC<JobSearchFormProps> = ({
  initialFilters,
  onFiltersChange,
}) => {
  const { register, watch, setValue, handleSubmit, reset } =
    useForm<JobSearchFilters>({
      resolver: zodResolver(JobSearchFiltersSchema),
      defaultValues: {
        query: '',
        location: '',
        jobType: 'all',
        salaryRange: [0, 200000],
        experience: 'all',
        remote: false,
        ...initialFilters,
      },
    });

  // Watch for real-time updates
  const watchedValues = watch();

  // Update parent component when filters change
  const onSubmit = (data: JobSearchFilters) => {
    onFiltersChange(data);
  };

  // Auto-submit on input change (debounced in parent)
  const handleInputChange = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('query')}
          placeholder="Job title, keywords, or company"
          onChange={handleInputChange}
        />

        <Input
          {...register('location')}
          placeholder="City, state, or remote"
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select {...register('jobType')} onChange={handleInputChange}>
          <option value="all">All Job Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </Select>

        <Select {...register('experience')} onChange={handleInputChange}>
          <option value="all">All Experience Levels</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
        </Select>

        <div className="flex items-center space-x-2">
          <Checkbox {...register('remote')} onChange={handleInputChange} />
          <label>Remote Only</label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Salary Range: ${watchedValues.salaryRange[0].toLocaleString()} - $
          {watchedValues.salaryRange[1].toLocaleString()}
        </label>
        <Slider
          value={watchedValues.salaryRange}
          onValueChange={(value) => {
            setValue('salaryRange', value as [number, number]);
            handleInputChange();
          }}
          max={300000}
          step={5000}
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Search Jobs
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            handleInputChange();
          }}
        >
          Clear
        </Button>
      </div>
    </form>
  );
};
```

---

## 🎨 **Styling Guidelines**

### **TailwindCSS Best Practices**

```tsx
// Good: Use semantic class combinations
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
  <span className="text-sm font-medium text-green-600">{job.salary}</span>
</div>;

// Better: Extract to component variants
const cardVariants = {
  default: 'p-4 bg-white rounded-lg shadow-sm border border-gray-200',
  elevated: 'p-6 bg-white rounded-xl shadow-lg border border-gray-100',
  interactive: 'hover:shadow-md transition-all duration-200 cursor-pointer',
};

// Best: Use cva for component variants
import { cva } from 'class-variance-authority';

const cardVariants = cva(
  'p-4 bg-white rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'shadow-sm border-gray-200',
        elevated: 'shadow-lg border-gray-100 p-6 rounded-xl',
        ghost: 'shadow-none border-transparent',
      },
      size: {
        sm: 'p-3 text-sm',
        md: 'p-4',
        lg: 'p-6 text-lg',
      },
      interactive: {
        true: 'hover:shadow-md cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      interactive: false,
    },
  }
);
```

### **Responsive Design Patterns**

```tsx
// Mobile-first responsive design
<div className="
  grid
  grid-cols-1
  gap-4
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
">
  {jobs.map(job => <JobCard key={job.id} job={job} />)}
</div>

// Responsive typography
<h1 className="
  text-2xl
  font-bold
  leading-tight
  sm:text-3xl
  lg:text-4xl
  xl:text-5xl
">
  Find Your Dream Job
</h1>

// Responsive spacing
<section className="
  px-4
  py-8
  sm:px-6
  lg:px-8
  lg:py-12
  xl:py-16
">
```

---

## 🚨 **Error Handling**

### **Error Boundary Component**

```tsx
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Send to monitoring service
    if (typeof window !== 'undefined') {
      // Send error to monitoring service (e.g., Sentry)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            We're sorry, but something unexpected happened.
          </p>
          <Button
            onClick={() => this.setState({ hasError: false, error: null })}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### **API Error Handling**

```tsx
// lib/api/errorHandler.ts
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: unknown): never => {
  if (error instanceof APIError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new APIError(error.message, 500);
  }

  throw new APIError('An unexpected error occurred', 500);
};

// Usage in API calls
export const apiCall = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || 'Request failed',
        response.status,
        errorData.code
      );
    }

    return await response.json();
  } catch (error) {
    handleAPIError(error);
  }
};
```

---

## 🔐 **Authentication Patterns**

### **Auth Hook**

```tsx
// hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/lib/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Protected route component
export const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

### **Role-Based Access Control**

```tsx
// components/RoleGuard.tsx
import { FC, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  children: ReactNode;
  roles: string[];
  fallback?: ReactNode;
}

export const RoleGuard: FC<RoleGuardProps> = ({
  children,
  roles,
  fallback,
}) => {
  const { user } = useAuth();

  const hasPermission = user?.roles?.some((role) => roles.includes(role));

  if (!hasPermission) {
    return fallback || <div>Access denied</div>;
  }

  return <>{children}</>;
};

// Usage
<RoleGuard roles={['admin', 'hr']}>
  <AdminPanel />
</RoleGuard>;
```

---

## ⚡ **Performance Optimization**

### **Code Splitting and Lazy Loading**

```tsx
// Lazy load components
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const JobDetail = lazy(() => import('@/components/features/JobDetail'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <JobDetail jobId={jobId} />
</Suspense>;

// Dynamic imports for heavy libraries
const loadChartLibrary = () => import('chart.js');

// Lazy load routes
const JobsPage = lazy(() => import('@/app/jobs/page'));
```

### **Memoization Patterns**

```tsx
// useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return jobs.reduce((acc, job) => {
    return acc + calculateJobScore(job);
  }, 0);
}, [jobs]);

// useCallback for event handlers
const handleJobClick = useCallback(
  (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  },
  [router]
);

// React.memo for component optimization
export const JobCard = memo<JobCardProps>(({ job, onApply }) => {
  return <Card>{/* Component content */}</Card>;
});
```

---

## 🧪 **Testing Guidelines**

### **Component Testing**

```tsx
// __tests__/components/JobCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { JobCard } from '@/components/features/JobCard';
import { mockJob } from '@/test/mocks';

describe('JobCard', () => {
  it('renders job information correctly', () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText(mockJob.title)).toBeInTheDocument();
    expect(screen.getByText(mockJob.company)).toBeInTheDocument();
    expect(screen.getByText(mockJob.location)).toBeInTheDocument();
  });

  it('calls onApply when apply button is clicked', () => {
    const mockOnApply = jest.fn();
    render(<JobCard job={mockJob} onApply={mockOnApply} />);

    fireEvent.click(screen.getByText('Apply Now'));
    expect(mockOnApply).toHaveBeenCalledWith(mockJob.id);
  });

  it('shows applied state when job is already applied', () => {
    const appliedJob = { ...mockJob, status: 'applied' };
    render(<JobCard job={appliedJob} />);

    expect(screen.getByText('Applied')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### **Hook Testing**

```tsx
// __tests__/hooks/useJobSearch.test.tsx
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useJobSearch } from '@/hooks/useJobSearch';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useJobSearch', () => {
  it('updates filters correctly', () => {
    const { result } = renderHook(() => useJobSearch(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateFilters({ query: 'developer' });
    });

    expect(result.current.filters.query).toBe('developer');
  });
});
```

---

## � **Debugging & Troubleshooting**

### **Common Development Issues**

**1. GraphQL Query Errors**

```bash
# Problem: GraphQL endpoint unreachable
# Solution: Check backend server is running on port 4000
cd backend && npm run dev

# Problem: Query syntax errors
# Solution: Use GraphQL Playground for testing
# Visit: http://localhost:4000/graphql
```

**2. TypeScript Compilation Errors**

```bash
# Check for type errors
pnpm type-check

# Common fixes:
# - Add missing types for props
# - Import types from correct modules
# - Use proper generic types for hooks
```

**3. Build or Test Failures**

```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install

# Reset test environment
pnpm test --clearCache
```

**4. Hot Reload Not Working**

```bash
# Check file watcher limits (Linux/macOS)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

# Restart development server
pnpm dev
```

### **Performance Debugging**

**Bundle Analysis:**

```bash
# Analyze bundle size
pnpm analyze

# Check what's in your bundle
npx next build --analyze
```

**Performance Profiling:**

```tsx
// Use React DevTools Profiler
import { Profiler } from 'react';

<Profiler
  id="JobSearch"
  onRender={(id, phase, actualDuration) => {
    console.log({ id, phase, actualDuration });
  }}
>
  <JobSearchComponent />
</Profiler>;
```

### **Network & API Debugging**

**GraphQL Debugging:**

```tsx
// Apollo Client dev tools
import { ApolloClient } from '@apollo/client';

const client = new ApolloClient({
  // Enable dev tools in development
  connectToDevTools: process.env.NODE_ENV === 'development',
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all', // Show partial data + errors
    },
  },
});
```

**Request Inspection:**

```bash
# Use browser dev tools Network tab
# Check request headers, response status
# Verify GraphQL queries are properly formatted
```

### **State Management Debugging**

**React Query DevTools:**

```tsx
// Add to your app in development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </>
  );
}
```

---

## 📚 **Learning Resources**

### **Essential Documentation**

**Framework & Core Technologies:**

- [Next.js 14 Documentation](https://nextjs.org/docs) - App Router and latest features
- [React 18 Documentation](https://react.dev) - Official React documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Complete TypeScript guide

**Styling & UI:**

- [TailwindCSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [shadcn/ui Components](https://ui.shadcn.com/) - Component library documentation
- [Framer Motion](https://www.framer.com/motion/) - Animation library

**Data Management:**

- [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL client documentation
- [React Query](https://tanstack.com/query/latest) - Data fetching and caching
- [Zod](https://zod.dev/) - Schema validation library

**Testing & Quality:**

- [Jest Documentation](https://jestjs.io/docs/getting-started) - Testing framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Component testing
- [ESLint Rules](https://eslint.org/docs/rules/) - Code quality rules

### **Advanced Topics**

**Performance Optimization:**

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance) - Core Web Vitals optimization
- [React Performance](https://react.dev/learn/render-and-commit) - Rendering optimization
- [Web Performance](https://web.dev/performance/) - Google's performance guide

**Security Best Practices:**

- [OWASP Frontend Security](https://owasp.org/www-project-front-end-security/) - Security guidelines
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers) - Security headers
- [Authentication Patterns](https://auth0.com/blog/complete-guide-to-react-user-authentication/) - Auth best practices

**Deployment & DevOps:**

- [Vercel Deployment](https://vercel.com/docs) - Production deployment
- [Docker Documentation](https://docs.docker.com/) - Containerization
- [GitHub Actions](https://docs.github.com/en/actions) - CI/CD workflows

### **Development Tools**

**VS Code Extensions (Recommended):**

- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Prettier - Code formatter
- ESLint
- TypeScript Importer
- Thunder Client (API testing)

**Browser DevTools:**

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Apollo Client DevTools](https://chrome.google.com/webstore/detail/apollo-client-devtools/jdkknkkbebbapilgoeccciglkfbmbnfm)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

### **Community & Support**

**Official Communities:**

- [Next.js Discord](https://discord.gg/nextjs) - Next.js community support
- [Reactiflux Discord](https://discord.gg/reactiflux) - React community
- [GraphQL Discord](https://discord.graphql.org/) - GraphQL community

**Stack Overflow Tags:**

- `next.js` - Next.js specific questions
- `reactjs` - React related issues
- `typescript` - TypeScript problems
- `graphql` - GraphQL queries and schema
- `tailwind-css` - Styling questions

---

## �📋 **Summary**

This guide provides comprehensive patterns for:

- ✅ **React Components**: Proper structure, props, and event handling
- ✅ **GraphQL**: Queries, mutations, and caching strategies
- ✅ **React Query**: Data fetching, caching, and optimistic updates
- ✅ **Type Safety**: Zod schemas for validation and type inference
- ✅ **Forms**: React Hook Form with validation and error handling
- ✅ **Styling**: TailwindCSS best practices and responsive design
- ✅ **Error Handling**: Boundaries, API errors, and user feedback
- ✅ **Authentication**: Protected routes and role-based access
- ✅ **Performance**: Code splitting, memoization, and optimization
- ✅ **Testing**: Component and hook testing strategies

Follow these patterns to build consistent, maintainable, and scalable features for the JobPay platform! 🚀

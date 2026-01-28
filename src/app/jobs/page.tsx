'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SEARCH_JOBS, TOGGLE_BOOKMARK, GET_BOOKMARKED_JOB_IDS } from '@/graphql/queries';
import Link from 'next/link';
import { Bookmark, BookmarkCheck, Search, Filter, X } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  description: string | null;
  budget: number;
  status: string;
  skills: string[];
  createdAt: string;
  applicationCount: number;
  bookmarkCount: number;
  poster: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
}

interface SearchResult {
  jobs: Job[];
  total: number;
  hasMore: boolean;
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 10;

  // Build filter object
  const filter = useMemo(() => ({
    search: searchTerm || undefined,
    skills: selectedSkills.length > 0 ? selectedSkills : undefined,
    budgetMin: budgetMin ? parseInt(budgetMin) : undefined,
    budgetMax: budgetMax ? parseInt(budgetMax) : undefined,
    status: 'OPEN',
  }), [searchTerm, selectedSkills, budgetMin, budgetMax]);

  const { loading, error, data, refetch } = useQuery(SEARCH_JOBS, {
    variables: {
      filter,
      pagination: { limit, offset: page * limit },
    },
  });

  const { data: bookmarksData } = useQuery(GET_BOOKMARKED_JOB_IDS, {
    fetchPolicy: 'cache-and-network',
  });

  const [toggleBookmark] = useMutation(TOGGLE_BOOKMARK, {
    refetchQueries: [{ query: GET_BOOKMARKED_JOB_IDS }],
  });

  const bookmarkedIds = new Set(bookmarksData?.bookmarkedJobIds || []);

  const handleToggleBookmark = useCallback(async (jobId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleBookmark({ variables: { jobId } });
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  }, [toggleBookmark]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    refetch();
  }, [refetch]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedSkills([]);
    setBudgetMin('');
    setBudgetMax('');
    setPage(0);
  }, []);

  const toggleSkill = useCallback((skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
    setPage(0);
  }, []);

  const searchResult: SearchResult | null = data?.searchJobs;
  const jobs = searchResult?.jobs || [];
  const total = searchResult?.total || 0;
  const hasMore = searchResult?.hasMore || false;

  const popularSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'GraphQL', 'AWS', 'Docker'];

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(budget);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Next Job
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search jobs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" /> Clear All
                </Button>
              </div>

              {/* Skills Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedSkills.includes(skill)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Budget (₹)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Budget (₹)
                  </label>
                  <Input
                    type="number"
                    placeholder="Any"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Results Count */}
          {!loading && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {total} jobs found
              {selectedSkills.length > 0 && ` matching ${selectedSkills.join(', ')}`}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400">
              Failed to load jobs. Please try again.
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </Card>
        )}

        {/* Jobs List */}
        <div className="grid gap-6">
          {jobs.map((job: Job) => (
            <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link href={`/jobs/${job.id}`}>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 hover:text-blue-600 transition-colors">
                          {job.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Posted by {job.poster.firstName || 'Anonymous'} {job.poster.lastName || ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(job.createdAt)}
                      </span>
                      <button
                        onClick={(e) => handleToggleBookmark(job.id, e)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        title={bookmarkedIds.has(job.id) ? 'Remove bookmark' : 'Bookmark job'}
                      >
                        {bookmarkedIds.has(job.id) ? (
                          <BookmarkCheck className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Bookmark className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-sm font-medium">
                      {formatBudget(job.budget)}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm">
                      {job.status}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded text-sm">
                      {job.applicationCount} applications
                    </span>
                  </div>

                  {job.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {job.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 5).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="px-2 py-1 text-gray-500 text-sm">
                        +{job.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:ml-6">
                  <Button variant="outline" asChild>
                    <Link href={`/jobs/${job.id}`}>View Details</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/jobs/${job.id}?apply=true`}>Apply Now</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No jobs found matching your criteria.
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}

        {/* Pagination */}
        {!loading && jobs.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page + 1} of {Math.ceil(total / limit)}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={!hasMore}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

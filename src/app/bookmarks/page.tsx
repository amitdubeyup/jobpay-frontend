'use client';

import { useQuery, useMutation } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GET_MY_BOOKMARKS, TOGGLE_BOOKMARK } from '@/graphql/queries';
import Link from 'next/link';
import { ArrowLeft, Trash2, Bookmark } from 'lucide-react';

interface BookmarkedJob {
  id: number;
  jobId: number;
  createdAt: string;
  job: {
    id: number;
    title: string;
    description: string | null;
    budget: number;
    status: string;
    skills: string[];
    applicationCount: number;
    poster: {
      firstName: string | null;
      lastName: string | null;
    };
  };
}

export default function BookmarksPage() {
  const { loading, error, data, refetch } = useQuery(GET_MY_BOOKMARKS);
  const [toggleBookmark, { loading: removing }] = useMutation(TOGGLE_BOOKMARK, {
    onCompleted: () => refetch(),
  });

  const bookmarks: BookmarkedJob[] = data?.myBookmarks || [];

  const handleRemove = async (jobId: number) => {
    try {
      await toggleBookmark({ variables: { jobId } });
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(budget);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/jobs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Saved Jobs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {bookmarks.length} job{bookmarks.length !== 1 ? 's' : ''} saved
          </p>
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
              Failed to load bookmarks. Please try again.
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </Card>
        )}

        {/* Bookmarks Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Link href={`/jobs/${bookmark.job.id}`}>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                        {bookmark.job.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {bookmark.job.poster.firstName} {bookmark.job.poster.lastName}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(bookmark.job.id)}
                    disabled={removing}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors text-gray-400 hover:text-red-600"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-sm font-medium">
                    {formatBudget(bookmark.job.budget)}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    bookmark.job.status === 'OPEN'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {bookmark.job.status}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded text-sm">
                    {bookmark.job.applicationCount} applied
                  </span>
                </div>

                {bookmark.job.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-1">
                    {bookmark.job.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mb-4">
                  {bookmark.job.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {bookmark.job.skills.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{bookmark.job.skills.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Saved {formatDate(bookmark.createdAt)}
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/jobs/${bookmark.job.id}`}>View</Link>
                    </Button>
                    {bookmark.job.status === 'OPEN' && (
                      <Button size="sm" asChild>
                        <Link href={`/jobs/${bookmark.job.id}?apply=true`}>Apply</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!loading && bookmarks.length === 0 && (
          <Card className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Saved Jobs
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Save jobs you&apos;re interested in to review them later.
            </p>
            <Button asChild>
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

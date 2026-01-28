'use client';

import { useQuery, useMutation } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GET_MY_APPLICATIONS, WITHDRAW_APPLICATION } from '@/graphql/queries';
import Link from 'next/link';
import { Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface Application {
  id: number;
  status: string;
  appliedAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  coverLetter: string | null;
  job: {
    id: number;
    title: string;
    budget: number;
    status: string;
    poster: {
      firstName: string | null;
      lastName: string | null;
    };
  };
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  PENDING: {
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    icon: <Clock className="w-4 h-4" />,
    label: 'Pending Review',
  },
  REVIEWED: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    icon: <AlertCircle className="w-4 h-4" />,
    label: 'Under Review',
  },
  SHORTLISTED: {
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Shortlisted',
  },
  ACCEPTED: {
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Accepted',
  },
  REJECTED: {
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    icon: <XCircle className="w-4 h-4" />,
    label: 'Rejected',
  },
  WITHDRAWN: {
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    icon: <XCircle className="w-4 h-4" />,
    label: 'Withdrawn',
  },
};

export default function MyApplicationsPage() {
  const { loading, error, data, refetch } = useQuery(GET_MY_APPLICATIONS);
  const [withdrawApplication, { loading: withdrawing }] = useMutation(WITHDRAW_APPLICATION, {
    onCompleted: () => refetch(),
  });

  const applications: Application[] = data?.myApplications || [];

  const handleWithdraw = async (applicationId: number) => {
    if (confirm('Are you sure you want to withdraw this application?')) {
      try {
        await withdrawApplication({ variables: { applicationId } });
      } catch (err) {
        console.error('Failed to withdraw:', err);
      }
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

  const canWithdraw = (status: string) => {
    return ['PENDING', 'REVIEWED', 'SHORTLISTED'].includes(status);
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
            My Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track the status of your job applications
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
              Failed to load applications. Please try again.
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </Card>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((application) => {
            const status = statusConfig[application.status] || statusConfig.PENDING;

            return (
              <Card key={application.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link href={`/jobs/${application.job.id}`}>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                            {application.job.title}
                          </h2>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400">
                          {application.job.poster.firstName} {application.job.poster.lastName}
                        </p>
                      </div>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        Budget: <strong>{formatBudget(application.job.budget)}</strong>
                      </span>
                      <span>
                        Applied: <strong>{formatDate(application.appliedAt)}</strong>
                      </span>
                      {application.reviewedAt && (
                        <span>
                          Reviewed: <strong>{formatDate(application.reviewedAt)}</strong>
                        </span>
                      )}
                    </div>

                    {application.coverLetter && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          <span className="font-medium">Cover Letter:</span> {application.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link href={`/jobs/${application.job.id}`}>View Job</Link>
                    </Button>
                    {canWithdraw(application.status) && (
                      <Button
                        variant="outline"
                        onClick={() => handleWithdraw(application.id)}
                        disabled={withdrawing}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && applications.length === 0 && (
          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start applying to jobs to track your applications here.
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

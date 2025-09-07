'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GET_JOBS } from '@/graphql/queries';
import Link from 'next/link';

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, error, data } = useQuery(GET_JOBS, {
    variables: { search: searchTerm },
  });

  // Mock data for demonstration
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $150k',
      description:
        'We are looking for a Senior Frontend Developer to join our team...',
      requirements: ['React', 'TypeScript', 'Node.js'],
      postedAt: '2 days ago',
    },
    {
      id: '2',
      title: 'React Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$90k - $120k',
      description: 'Join our fast-growing startup as a React Developer...',
      requirements: ['React', 'JavaScript', 'CSS'],
      postedAt: '1 week ago',
    },
    {
      id: '3',
      title: 'Full Stack Engineer',
      company: 'MegaCorp',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$130k - $160k',
      description:
        'We need a Full Stack Engineer to work on our core platform...',
      requirements: ['React', 'Node.js', 'PostgreSQL'],
      postedAt: '3 days ago',
    },
  ];

  const jobs = data?.jobs || mockJobs;

  const filteredJobs = jobs.filter(
    (job: any) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    console.error('GraphQL Error:', error);
    // Continue with mock data
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Next Job
          </h1>
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        <div className="grid gap-6">
          {filteredJobs.map((job: any, index: number) => (
            <div key={job.id}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                          {job.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {job.company} • {job.location}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {job.postedAt}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm">
                        {job.type}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-sm">
                        {job.salary}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements.map((req: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                    <Button variant="outline" asChild>
                      <Link href={`/jobs/${job.id}`}>View Details</Link>
                    </Button>
                    <Button>Apply Now</Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No jobs found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

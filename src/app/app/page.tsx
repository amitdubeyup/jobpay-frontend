'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AppDashboard() {
  const stats = [
    { label: 'Applications Sent', value: '23', change: '+12%' },
    { label: 'Interviews Scheduled', value: '5', change: '+25%' },
    { label: 'Job Offers', value: '2', change: '+100%' },
    { label: 'Response Rate', value: '68%', change: '+8%' },
  ];

  const recentApplications = [
    {
      company: 'Google',
      position: 'Frontend Developer',
      status: 'Interview',
      date: '2 days ago',
    },
    {
      company: 'Microsoft',
      position: 'React Developer',
      status: 'Applied',
      date: '5 days ago',
    },
    {
      company: 'Netflix',
      position: 'UI Engineer',
      status: 'Offer',
      date: '1 week ago',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, John!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here&apos;s an overview of your job search progress.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.label}>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Applications
          </h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {recentApplications.map((app, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                    {app.company.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {app.position}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {app.company}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    app.status === 'Offer'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : app.status === 'Interview'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {app.status}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {app.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

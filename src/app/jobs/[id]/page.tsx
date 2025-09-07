'use client';

import { useQuery } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GET_JOB_BY_ID } from '@/graphql/queries';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, DollarSign, Building } from 'lucide-react';

interface JobDetailProps {
  params: { id: string };
}

export default function JobDetailPage({ params }: JobDetailProps) {
  const { loading, error, data } = useQuery(GET_JOB_BY_ID, {
    variables: { id: params.id },
  });

  // Mock data for demonstration
  const mockJob = {
    id: params.id,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    description: `We are looking for a Senior Frontend Developer to join our innovative team at TechCorp Inc. 
    You will be responsible for building and maintaining our cutting-edge web applications using modern 
    technologies like React, TypeScript, and Next.js.`,
    requirements: [
      '5+ years of experience with React and TypeScript',
      'Strong knowledge of modern JavaScript (ES6+)',
      'Experience with state management (Redux, Zustand)',
      'Familiarity with testing frameworks (Jest, React Testing Library)',
      'Knowledge of CSS-in-JS solutions (styled-components, emotion)',
      'Experience with GraphQL and Apollo Client',
      'Understanding of web performance optimization',
      "Bachelor's degree in Computer Science or equivalent experience",
    ],
    responsibilities: [
      'Develop and maintain high-quality React applications',
      'Collaborate with design and backend teams',
      'Write clean, maintainable, and testable code',
      'Participate in code reviews and technical discussions',
      'Mentor junior developers',
      'Stay up-to-date with the latest frontend technologies',
    ],
    benefits: [
      'Competitive salary and equity package',
      'Health, dental, and vision insurance',
      'Flexible working hours and remote work options',
      'Professional development budget',
      '401(k) with company matching',
      'Unlimited PTO policy',
      'Modern office with free snacks and drinks',
    ],
    postedAt: '2 days ago',
    companyInfo: {
      size: '100-500 employees',
      industry: 'Technology',
      founded: '2015',
      website: 'https://techcorp.com',
    },
  };

  const job = data?.job || mockJob;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('GraphQL Error:', error);
    // Continue with mock data
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/jobs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {job.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {job.postedAt}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                  <Button variant="outline">Save Job</Button>
                  <Button>Apply Now</Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                  {job.type}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm flex items-center">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {job.salary}
                </span>
              </div>
            </Card>

            {/* Job Description */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Job Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {job.description}
              </p>
            </Card>

            {/* Requirements */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Requirements
              </h2>
              <ul className="space-y-2">
                {job.requirements.map((req: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start text-gray-600 dark:text-gray-400"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {req}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Responsibilities */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Responsibilities
              </h2>
              <ul className="space-y-2">
                {job.responsibilities.map((resp: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start text-gray-600 dark:text-gray-400"
                  >
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {resp}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                About {job.company}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Industry:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {job.companyInfo.industry}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Company Size:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {job.companyInfo.size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Founded:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {job.companyInfo.founded}
                  </span>
                </div>
              </div>
            </Card>

            {/* Benefits */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Benefits & Perks
              </h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Apply Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ready to Apply?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Join {job.company} and be part of an innovative team building
                the future.
              </p>
              <Button className="w-full" size="lg">
                Apply Now
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

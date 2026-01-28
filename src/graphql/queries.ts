import { gql } from '@apollo/client';

// Job Fragments
export const JOB_FIELDS = gql`
  fragment JobFields on Job {
    id
    title
    description
    budget
    status
    skills
    isActive
    createdAt
    updatedAt
    posterId
    applicationCount
    bookmarkCount
    poster {
      id
      firstName
      lastName
      email
    }
  }
`;

// Job Queries
export const GET_JOBS = gql`
  query GetJobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      ...JobFields
    }
  }
  ${JOB_FIELDS}
`;

export const SEARCH_JOBS = gql`
  query SearchJobs($filter: JobFilterInput, $pagination: PaginationInput) {
    searchJobs(filter: $filter, pagination: $pagination) {
      jobs {
        ...JobFields
      }
      total
      limit
      offset
      hasMore
    }
  }
  ${JOB_FIELDS}
`;

export const GET_JOB_BY_ID = gql`
  query GetJobById($id: Int!) {
    job(id: $id) {
      ...JobFields
    }
  }
  ${JOB_FIELDS}
`;

export const GET_MY_JOBS = gql`
  query GetMyJobs {
    myJobs {
      ...JobFields
    }
  }
  ${JOB_FIELDS}
`;

// Job Mutations
export const CREATE_JOB = gql`
  mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      ...JobFields
    }
  }
  ${JOB_FIELDS}
`;

export const UPDATE_JOB_STATUS = gql`
  mutation UpdateJobStatus($id: Int!, $status: String!) {
    updateJobStatus(id: $id, status: $status) {
      ...JobFields
    }
  }
  ${JOB_FIELDS}
`;

// Application Fragments
export const APPLICATION_FIELDS = gql`
  fragment ApplicationFields on Application {
    id
    coverLetter
    resumeUrl
    status
    appliedAt
    updatedAt
    reviewedAt
    applicantId
    jobId
    applicant {
      id
      firstName
      lastName
      email
    }
    job {
      id
      title
      budget
      status
      poster {
        id
        firstName
        lastName
      }
    }
  }
`;

// Application Queries
export const GET_MY_APPLICATIONS = gql`
  query GetMyApplications {
    myApplications {
      ...ApplicationFields
    }
  }
  ${APPLICATION_FIELDS}
`;

export const GET_JOB_APPLICATIONS = gql`
  query GetJobApplications($jobId: Int!) {
    jobApplications(jobId: $jobId) {
      ...ApplicationFields
    }
  }
  ${APPLICATION_FIELDS}
`;

export const GET_APPLICATION = gql`
  query GetApplication($id: Int!) {
    application(id: $id) {
      ...ApplicationFields
    }
  }
  ${APPLICATION_FIELDS}
`;

// Application Mutations
export const APPLY_TO_JOB = gql`
  mutation ApplyToJob($input: CreateApplicationInput!) {
    applyToJob(input: $input) {
      ...ApplicationFields
    }
  }
  ${APPLICATION_FIELDS}
`;

export const WITHDRAW_APPLICATION = gql`
  mutation WithdrawApplication($applicationId: Int!) {
    withdrawApplication(applicationId: $applicationId) {
      ...ApplicationFields
    }
  }
  ${APPLICATION_FIELDS}
`;

export const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus($input: UpdateApplicationStatusInput!) {
    updateApplicationStatus(input: $input) {
      ...ApplicationFields
    }
  }
  ${APPLICATION_FIELDS}
`;

// Bookmark Queries
export const GET_MY_BOOKMARKS = gql`
  query GetMyBookmarks {
    myBookmarks {
      id
      jobId
      createdAt
      job {
        ...JobFields
      }
    }
  }
  ${JOB_FIELDS}
`;

export const IS_JOB_BOOKMARKED = gql`
  query IsJobBookmarked($jobId: Int!) {
    isJobBookmarked(jobId: $jobId)
  }
`;

export const GET_BOOKMARKED_JOB_IDS = gql`
  query GetBookmarkedJobIds {
    bookmarkedJobIds
  }
`;

// Bookmark Mutations
export const TOGGLE_BOOKMARK = gql`
  mutation ToggleBookmark($jobId: Int!) {
    toggleBookmark(jobId: $jobId) {
      success
      isBookmarked
    }
  }
`;

export const BOOKMARK_JOB = gql`
  mutation BookmarkJob($jobId: Int!) {
    bookmarkJob(jobId: $jobId) {
      id
      jobId
      createdAt
    }
  }
`;

export const UNBOOKMARK_JOB = gql`
  mutation UnbookmarkJob($jobId: Int!) {
    unbookmarkJob(jobId: $jobId)
  }
`;

// Subscriptions
export const JOB_UPDATES_SUBSCRIPTION = gql`
  subscription JobUpdates {
    jobUpdates {
      type
      jobId
      jobTitle
      message
      timestamp
      status
    }
  }
`;

export const MY_APPLICATION_UPDATES_SUBSCRIPTION = gql`
  subscription MyApplicationUpdates {
    myApplicationUpdates {
      type
      applicationId
      jobId
      jobTitle
      applicantId
      status
      message
      timestamp
    }
  }
`;

export const MY_JOB_APPLICATIONS_SUBSCRIPTION = gql`
  subscription MyJobApplications {
    myJobApplications {
      type
      applicationId
      jobId
      jobTitle
      applicantId
      applicantName
      status
      message
      timestamp
    }
  }
`;

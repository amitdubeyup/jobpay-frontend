import { gql } from '@apollo/client';

export const GET_JOBS = gql`
  query GetJobs($limit: Int, $offset: Int, $filters: JobFilters) {
    jobs(limit: $limit, offset: $offset, filters: $filters) {
      id
      title
      company
      location
      type
      description
      requirements
      salary {
        min
        max
        currency
      }
      postedAt
      expiresAt
      isRemote
      tags
    }
  }
`;

export const GET_JOB_BY_ID = gql`
  query GetJobById($id: ID!) {
    job(id: $id) {
      id
      title
      company
      location
      type
      description
      requirements
      salary {
        min
        max
        currency
      }
      postedAt
      expiresAt
      isRemote
      tags
    }
  }
`;

export const CREATE_APPLICATION = gql`
  mutation CreateApplication($input: ApplicationInput!) {
    createApplication(input: $input) {
      id
      jobId
      userId
      status
      appliedAt
      coverLetter
    }
  }
`;

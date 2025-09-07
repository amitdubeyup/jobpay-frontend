export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE';
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  postedAt: string;
  expiresAt?: string;
  isRemote: boolean;
  tags: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'USER' | 'EMPLOYER' | 'ADMIN';
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'PENDING' | 'REVIEWED' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED';
  appliedAt: string;
  coverLetter?: string;
  resume?: string;
}

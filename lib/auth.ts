/**
 * Authentication and Authorization Configuration
 * Implements role-based access control and security measures
 */

import { NextRequest, NextResponse } from 'next/server';

// User roles and permissions
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum Permission {
  READ_JOBS = 'read:jobs',
  CREATE_JOBS = 'create:jobs',
  UPDATE_JOBS = 'update:jobs',
  DELETE_JOBS = 'delete:jobs',
  MANAGE_USERS = 'manage:users',
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_SETTINGS = 'manage:settings',
}

// Role-Permission mapping
export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.GUEST]: [Permission.READ_JOBS],
  [UserRole.USER]: [
    Permission.READ_JOBS,
    Permission.CREATE_JOBS,
    Permission.UPDATE_JOBS,
  ],
  [UserRole.ADMIN]: [
    Permission.READ_JOBS,
    Permission.CREATE_JOBS,
    Permission.UPDATE_JOBS,
    Permission.DELETE_JOBS,
    Permission.VIEW_ANALYTICS,
  ],
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
};

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication helpers
export class AuthService {
  static hasPermission(user: User | null, permission: Permission): boolean {
    if (!user) return false;

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  }

  static hasRole(user: User | null, role: UserRole): boolean {
    if (!user) return false;
    return user.role === role;
  }

  static isAdmin(user: User | null): boolean {
    if (!user) return false;
    return user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
  }

  static canAccess(
    user: User | null,
    requiredPermissions: Permission[]
  ): boolean {
    if (!user) return false;

    return requiredPermissions.every((permission) =>
      this.hasPermission(user, permission)
    );
  }
}

// Middleware for API route protection
export function withAuth(
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Missing or invalid authorization header' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);

      // Validate token (implement your token validation logic)
      const user = await validateToken(token);
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Check if user is active
      if (!user.isActive) {
        return NextResponse.json(
          { error: 'Account is deactivated' },
          { status: 403 }
        );
      }

      return handler(req, user);
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

// Permission-based middleware
export function withPermission(
  permissions: Permission[],
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(async (req: NextRequest, user: User) => {
    if (!AuthService.canAccess(user, permissions)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

// Rate limiting configuration
export const rateLimits = {
  login: { max: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  api: { max: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  upload: { max: 10, windowMs: 60 * 1000 }, // 10 uploads per minute
} as const;

// Security headers for authentication routes
export const authSecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

// Token validation (implement based on your auth provider)
async function validateToken(token: string): Promise<User | null> {
  // This is a placeholder - implement your actual token validation
  // For example, with JWT, NextAuth, or your preferred auth solution
  try {
    // Decode and verify token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // return await getUserById(decoded.sub);

    // For now, return null (implement your logic)
    return null;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

// Password validation rules
export const passwordRules = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128,
} as const;

export function validatePassword(password: string): boolean {
  if (password.length < passwordRules.minLength) return false;
  if (password.length > passwordRules.maxLength) return false;

  if (passwordRules.requireUppercase && !/[A-Z]/.test(password)) return false;
  if (passwordRules.requireLowercase && !/[a-z]/.test(password)) return false;
  if (passwordRules.requireNumbers && !/\d/.test(password)) return false;
  if (
    passwordRules.requireSpecialChars &&
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  )
    return false;

  return true;
}

/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */
import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
        company: string;
        plan: string;
        createdAt: Date;
    };
}
/**
 * Middleware to verify JWT token
 */
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Optional auth middleware - doesn't fail if no token
 */
export declare function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): void;
/**
 * Middleware to check if user has required plan
 */
export declare function requirePlan(...allowedPlans: string[]): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Generate a JWT token for a user
 */
export declare function generateToken(userId: string, email: string): string;
/**
 * Verify a JWT token
 */
export declare function verifyToken(token: string): {
    userId: string;
    email: string;
} | null;
//# sourceMappingURL=auth.d.ts.map
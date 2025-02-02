import { NextApiRequest, NextApiResponse } from 'next';
import { PrivyClient } from '@privy-io/server-auth';
import { PRIVY_APP_ID, PRIVY_APP_SECRET } from '../config/constant';

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

const protectedPaths = [
    '/api/check-privy-wallet',
    '/api/create-privy-wallet',
    '/api/add-token',
    '/api/getTokenDetails',
    '/api/send-email',
    '/api/store-transaction',
    '/api/update-transaction',
    '/api/user-data'
];

const allowedDomains = {
    development: process.env.NEXT_PUBLIC_DEVELOPMENT_URL?.split(','),
    production: process.env.NEXT_PUBLIC_PRODUCTION_URL?.split(',')
};

const isProtectedPath = (path: string): boolean => {
    return protectedPaths.some(pattern => {
        const regexPattern = pattern
            .replace(/\*/g, '.*')
            .replace(/\//g, '\\/');
        return new RegExp(`^${regexPattern}$`).test(path);
    });
};

const isValidDomain = (origin: string | undefined): boolean => {
    if (!origin) return false;
    
    const env = process.env.NODE_ENV || 'development';
    const allowed = allowedDomains[env as keyof typeof allowedDomains] || [];
    
    return allowed.some(domain => {
        // Remove trailing slashes
        const sanitizedDomain = domain.trim().replace(/\/+$/, '');
        if (env === 'development') {
            return origin.includes(sanitizedDomain);
        }
        return origin === sanitizedDomain || origin === `https://${sanitizedDomain}`;
    });
};

export const privyAuthMiddleware = (handler: NextApiHandler): NextApiHandler => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const path = req.url?.split('?')[0] ?? '';
        const origin = req.headers.origin || req.headers.referer;

        console.log("This is the origin in the backend",origin);
        if (!isProtectedPath(path)) {
            return handler(req, res);
        }

        if (!isValidDomain(origin)) {
            return res.status(403).json({ 
                message: 'Forbidden: Invalid Domain Origin'
            });
        }

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                message: 'Unauthorized: No Token Provided'
            });
        }

        try {
            const privyClient = new PrivyClient(
                PRIVY_APP_ID!,
                PRIVY_APP_SECRET!
            );

            const isValid = await privyClient.verifyAuthToken(token);
            if (!isValid) {
                return res.status(401).json({ 
                    message: 'Unauthorized: Invalid Token'
                });
            }

            return handler(req, res);
        } catch (error) {
            console.error('Privy Authentication Error:', error);
            return res.status(500).json({ 
                message: 'Internal Server Error'
            });
        }
    };
};
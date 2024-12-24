import { NextApiRequest, NextApiResponse } from 'next';
import { PrivyClient } from '@privy-io/server-auth';

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

const protectedPaths = [
    '/api/check-privy-wallet',
    '/api/create-privy-wallet',
    '/api/settings/*'
    // Add more protected paths here
];

const isProtectedPath = (path: string): boolean => {
    return protectedPaths.some(pattern => {
        const regexPattern = pattern
            .replace(/\*/g, '.*')
            .replace(/\//g, '\\/');
        return new RegExp(`^${regexPattern}$`).test(path);
    });
};

export const privyAuthMiddleware = (handler: NextApiHandler): NextApiHandler => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const path = req.url?.split('?')[0] ?? '';

        if (!isProtectedPath(path)) {
            return handler(req, res);
        }

        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        try {
            const privyClient = new PrivyClient(
                process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
                process.env.PRIVY_APP_SECRET!
            );

            const isValid = await privyClient.verifyAuthToken(token);

            if (!isValid) {
                return res.status(401).json({ message: 'Unauthorized: Invalid token' });
            }

            return handler(req, res);
        } catch (error) {
            console.error('Privy authentication error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};
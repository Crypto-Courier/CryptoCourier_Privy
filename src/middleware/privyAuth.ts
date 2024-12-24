import { NextApiRequest, NextApiResponse } from 'next';
import { PrivyClient } from '@privy-io/server-auth';

export async function privyAuthMiddleware(req: NextApiRequest, res: NextApiResponse, next: Function) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.error('No token provided');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log("Token received:", token);

    try {
        const privyClient = new PrivyClient(
            process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
            process.env.PRIVY_APP_SECRET!
        );

        // Verify the token
        const isValid = await privyClient.verifyAuthToken(token);

        console.log("Validation status:", isValid);

        if (!isValid) {
            console.error('Invalid token');
            return res.status(401).json({ message: 'Invalid token' });
        }

        next();
    } catch (error) {
        console.error('Error verifying Privy token:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
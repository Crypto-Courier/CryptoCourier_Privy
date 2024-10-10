import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email } = req.body;
        
        const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
        const privyAppSecret = process.env.NEXT_PUBLIC_PRIVY_APP_SECRET;

        if (!privyAppId || !privyAppSecret) {
            console.error('Privy app ID or secret is missing');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        try {
            const response = await fetch('https://auth.privy.io/api/v1/users', {
                method: 'POST',
                headers: {
                    'privy-app-id': privyAppId,
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from(`${privyAppId}:${privyAppSecret}`).toString('base64'),
                },
                body: JSON.stringify({
                    create_ethereum_wallet: true,
                    linked_accounts: [{ address: email, type: 'email' }],
                }),
            });

            const data = await response.json();
            // console.log(data);
            return res.status(response.status).json(data);
        } catch (error) {
            console.error('Error creating wallet:', error);
            return res.status(500).json({ error: 'Failed to create wallet' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
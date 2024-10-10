// pages/api/getBTTBalance.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ message: 'Invalid wallet address' });
  }

  try {
    const response = await axios.get(`https://api-testnet.bttcscan.com/api`, {
      params: {
        module: 'account',
        action: 'balance',
        address: address,
        tag: 'latest',
        apikey: process.env.BTTCSCAN_API_KEY, // Make sure to set this in your .env.local file
      },
    });

    const data = response.data;

    if (data.status === '1') {
      const balanceInBTT = parseFloat(data.result) / 1e18;
      return res.status(200).json({ balance: balanceInBTT.toFixed(2) });
    } else {
      console.error('Error fetching BTT balance:', data.message);
      return res.status(500).json({ message: 'Error fetching BTT balance' });
    }
  } catch (error) {
    console.error('Error fetching BTT balance:', error);
    return res.status(500).json({ message: 'Error fetching BTT balance' });
  }
}
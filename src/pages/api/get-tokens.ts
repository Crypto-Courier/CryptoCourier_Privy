import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { ethers } from 'ethers';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, retries = 3, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
      if (response.status === 429) {
        // console.log(`Rate limited, retrying in ${delayMs}ms...`);
        await delay(delayMs);
        continue;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      // console.log(`Error fetching data, retrying in ${delayMs}ms...`);
      await delay(delayMs);
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Valid address is required' });
  }

  const apiKey = process.env.BTTC_API_KEY;

  if (!apiKey) {
    console.error("BTTC_API_KEY is not set");
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('tokenDatabase');
    const tokens = await db.collection('tokens').find({}).toArray();

    // console.log(`Found ${tokens.length} tokens in the database`);

    const tokenBalances = [];

    for (const token of tokens) {
      try {
        const url = `https://api-testnet.bttcscan.com/api?module=account&action=tokenbalance&contractaddress=${token.contractAddress}&address=${address}&tag=latest&apikey=${apiKey}`;
        const data = await fetchWithRetry(url);

        if (data.status === '1' && data.message === 'OK') {
          const rawBalance = data.result;
          const formattedBalance = ethers.formatUnits(rawBalance, token.decimals);
          tokenBalances.push({
            ...token,
            balance: formattedBalance,
            rawBalance
          });
        } else {
          console.error(`Error fetching balance for token ${token.contractAddress}:`, data.message);
        }

        // Add a small delay between requests to avoid rate limiting
        await delay(200);
      } catch (error) {
        console.error(`Error processing token ${token.contractAddress}:`, error);
      }
    }

    // console.log(`Returning ${tokenBalances.length} token balances`);
    return res.status(200).json(tokenBalances);
  } catch (error) {
    console.error("Error in token fetching process:", error);
    return res.status(500).json({ error: 'Failed to fetch tokens' });
  }
}
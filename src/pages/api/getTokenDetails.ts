import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://pre-rpc.bittorrentchain.io/');  // BTTC RPC URL

// ABI for ERC-20 functions to fetch token details
const abi = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function"
  }
];

export default async function getTokenDetails(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { tokenAddress } = req.body;

  if (!tokenAddress) {
    return res.status(400).json({ message: 'Token address is required' });
  }

  if (!ethers.isAddress(tokenAddress)) {
    return res.status(400).json({ message: 'Invalid token address' });
  }

  try {
    // Create a contract instance
    const contract = new ethers.Contract(tokenAddress, abi, provider);

    // Fetch token details
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = (await contract.decimals()).toString(); // Convert BigInt to string

    // Send the response
    res.status(200).json({
      name,
      symbol,
      decimals
    });
  } catch (error) {
    console.error('Error fetching token details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

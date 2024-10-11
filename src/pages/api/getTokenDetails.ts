import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import chainConfig from '../../config/chains';

const abi = [
  { constant: true, inputs: [], name: "name", outputs: [{ name: "", type: "string" }], type: "function" },
  { constant: true, inputs: [], name: "symbol", outputs: [{ name: "", type: "string" }], type: "function" },
  { constant: true, inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], type: "function" }
];

const NATIVE_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

function handleError(error: any): { message: string; details: any } {
  if (error instanceof Error) {
    if (error.message.includes('call revert exception')) {
      return { message: 'Contract call reverted. The token contract might not be ERC20 compliant.', details: error.message };
    } else if (error.message.includes('invalid address')) {
      return { message: 'Invalid Ethereum address provided.', details: error.message };
    } else if (error.message.includes('network does not support ENS')) {
      return { message: 'ENS is not supported on this network.', details: error.message };
    } else if (error.message.includes('insufficient funds')) {
      return { message: 'RPC node has insufficient funds for this operation.', details: error.message };
    } else if (error.message.includes('nonce has already been used')) {
      return { message: 'Transaction nonce already used. This is an RPC node issue.', details: error.message };
    }
  }
  
  if (typeof error === 'object' && error !== null) {
    if ('code' in error) {
      switch (error.code) {
        case 'ETIMEDOUT':
          return { message: 'Request to RPC node timed out. The node might be unresponsive.', details: error };
        case 'ECONNREFUSED':
          return { message: 'Connection to RPC node refused. Check if the RPC URL is correct and accessible.', details: error };
        default:
          return { message: `Unexpected error code: ${error.code}`, details: error };
      }
    }
  }
  
  return { message: 'An unexpected error occurred', details: error };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { tokenAddress, chainId } = req.body;

  if (!tokenAddress || !chainId) {
    return res.status(400).json({ message: 'Token address and chain ID are required' });
  }

  const chainData = chainConfig[chainId];
  if (!chainData) {
    return res.status(400).json({ message: 'Unsupported chain ID', details: { providedChainId: chainId, supportedChainIds: Object.keys(chainConfig) } });
  }

  try {
    let tokenDetails;

    if (tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()) {
      tokenDetails = {
        name: chainData.nativeCurrency.name,
        symbol: chainData.nativeCurrency.symbol,
        decimals: chainData.nativeCurrency.decimals.toString(),
        chain: chainData.name
      };
    } else {
      if (!ethers.isAddress(tokenAddress)) {
        return res.status(400).json({ message: 'Invalid token address', details: { providedAddress: tokenAddress } });
      }

      let provider;
      try {
        provider = new ethers.JsonRpcProvider(chainData.rpcUrl);
      } catch (error) {
        const { message, details } = handleError(error);
        return res.status(500).json({ message: `Failed to create provider: ${message}`, details });
      }

      let contract;
      try {
        contract = new ethers.Contract(tokenAddress, abi, provider);
      } catch (error) {
        const { message, details } = handleError(error);
        return res.status(500).json({ message: `Failed to create contract instance: ${message}`, details });
      }

      try {
        const [name, symbol, decimals] = await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.decimals(),
        ]);

        tokenDetails = {
          name,
          symbol,
          decimals: decimals.toString(),
          chain: chainData.name
        };
      } catch (error) {
        const { message, details } = handleError(error);
        return res.status(500).json({ message: `Failed to fetch token details: ${message}`, details });
      }
    }

    res.status(200).json(tokenDetails);
  } catch (error: any) {
    const { message, details } = handleError(error);
    console.error('Error fetching token details:', error);
    res.status(500).json({ message: `Error fetching token details: ${message}`, details });
  }
}
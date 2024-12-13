import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import { ethers } from 'ethers';
import chainConfig from '../../config/chains';
import ERC20_ABI from '../../abis/ERC-20.json';
import {TokenConfig} from '../../types/types'

const NATIVE_CURRENCY_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, chainId } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Valid address is required' });
  }

  if (!chainId || typeof chainId !== 'string') {
    return res.status(400).json({ error: 'Valid chainId is required' });
  }

  const chainIdNumber = parseInt(chainId);

  if (!chainConfig[chainIdNumber]) {
    return res.status(400).json({ error: 'Unsupported chain ID' });
  }

  try {
    await dbConnect();
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    
    const tokens = await db.collection('tokens').find({ chainId: chainIdNumber }).toArray();

    const provider = new ethers.JsonRpcProvider(chainConfig[chainIdNumber].rpcUrl);

    if (!provider) {
      return res.status(400).json({ error: 'Unsupported chain ID' });
    }

    const tokenBalances = await Promise.all(tokens.map(async (token: TokenConfig) => {
      try {
        if (token.contractAddress.toLowerCase() === NATIVE_CURRENCY_ADDRESS.toLowerCase()) {
          const balance = await provider.getBalance(address);
          const formattedBalance = ethers.formatUnits(balance, chainConfig[chainIdNumber].nativeCurrency.decimals);
          
          if (balance > BigInt(0)) { // Using BigInt() constructor instead of literal
            return {
              ...token,
              balance: formattedBalance,
              rawBalance: balance.toString(),
            };
          }
        } else {
          const contract = new ethers.Contract(token.contractAddress, ERC20_ABI, provider);
          const balance = await contract.balanceOf(address);
          
          if (balance > BigInt(0)) { // Using BigInt() constructor instead of literal
            const formattedBalance = ethers.formatUnits(balance, token.decimals);
            return {
              ...token,
              balance: formattedBalance,
              rawBalance: balance.toString(),
            };
          }
        }
      } catch (error) {
        console.error(`Error fetching balance for token ${token.contractAddress}:`, error);
      }
      return null;
    }));

    const filteredTokenBalances = tokenBalances.filter(token => token !== null);

    const nativeBalance = await provider.getBalance(address);
    const formattedNativeBalance = ethers.formatUnits(nativeBalance, chainConfig[chainIdNumber].nativeCurrency.decimals);

    const responseData = {
      tokens: filteredTokenBalances,
      nativeCurrency: {
        ...chainConfig[chainIdNumber].nativeCurrency,
        balance: formattedNativeBalance,
        rawBalance: nativeBalance.toString(),
      },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in token fetching process:", error);
    return res.status(500).json({ error: 'Failed to fetch tokens' });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { getTokenCollection } from "../../lib/getCollections";
import chainConfig from "../../config/chains";
import ERC20_ABI from "../../abis/ERC-20.json";

const NATIVE_CURRENCY_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

// Interface for token with balance
interface TokenWithBalance {
  contractAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  balance: string;
  rawBalance: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate input parameters
  const { address, chainId } = req.query;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Valid wallet address is required" });
  }

  if (!chainId || typeof chainId !== "string") {
    return res.status(400).json({ error: "Valid chainId is required" });
  }

  const chainIdNumber = parseInt(chainId);

  // Validate chain configuration
  if (!chainConfig[chainIdNumber]) {
    return res.status(400).json({ error: "Unsupported chain ID" });
  }

  try {
    // Establish database connection
    const TokenModel = await getTokenCollection();

    // Fetch tokens for the specific chain
    const tokens = await TokenModel.find({ chainId: chainIdNumber });

    // Create provider for the specific chain
    const provider = new ethers.JsonRpcProvider(
      chainConfig[chainIdNumber].rpcUrl
    );

    if (!provider) {
      return res.status(400).json({ error: "Unable to create provider for the chain" });
    }

    // Fetch token balances
    const tokenBalances: TokenWithBalance[] = (await Promise.all(
      tokens.map(async (token) => {
        try {
          // Handle native currency separately
          if (token.contractAddress.toLowerCase() === NATIVE_CURRENCY_ADDRESS.toLowerCase()) {
            const balance = await provider.getBalance(address);
            const formattedBalance = ethers.formatUnits(balance, chainConfig[chainIdNumber].nativeCurrency.decimals);
            
            return balance > BigInt(0) ? {
              contractAddress: token.contractAddress,
              symbol: token.symbol,
              name: token.name,
              decimals: token.decimals,
              chainId: token.chainId,
              balance: formattedBalance,
              rawBalance: balance.toString(),
            } : null;
          }

          // Handle ERC20 tokens
          const contract = new ethers.Contract(token.contractAddress, ERC20_ABI, provider);
          const balance = await contract.balanceOf(address);
          
          return balance > BigInt(0) ? {
            contractAddress: token.contractAddress,
            symbol: token.symbol,
            name: token.name,
            decimals: token.decimals,
            chainId: token.chainId,
            balance: ethers.formatUnits(balance, token.decimals),
            rawBalance: balance.toString(),
          } : null;
        } catch (error) {
          console.error(`Error fetching balance for token ${token.contractAddress}:`, error);
          return null;
        }
      })
    )).filter((token): token is TokenWithBalance => token !== null);

    // Fetch native currency balance
    const nativeBalance = await provider.getBalance(address);
    const formattedNativeBalance = ethers.formatUnits(
      nativeBalance,
      chainConfig[chainIdNumber].nativeCurrency.decimals
    );

    // Prepare response
    const responseData = {
      tokens: tokenBalances,
      nativeCurrency: {
        ...chainConfig[chainIdNumber].nativeCurrency,
        balance: formattedNativeBalance,
        rawBalance: nativeBalance.toString(),
      },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in token fetching process:", error);
    return res.status(500).json({ 
      error: "Failed to fetch tokens", 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
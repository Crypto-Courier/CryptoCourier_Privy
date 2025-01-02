import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import chainConfig from "../../config/chains";

const COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Parse request parameters
    const { chainId, to, value, data } = req.query;

    if (!chainId || !to) {
      return res.status(400).json({ error: "Missing required parameters: chainId or to" });
    }

    const chainIdNumber = parseInt(chainId as string, 10);
    const config = chainConfig[chainIdNumber];
    if (!config) {
      return res.status(400).json({ error: `Unsupported chainId: ${chainId}` });
    }

    // Initialize ethers provider
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);

    // Estimate the gas limit
    const transaction = {
      to: to as string, // Recipient address
      value: value ? ethers.parseEther(value as string) : BigInt(0), // Value in ETH (default: 0 ETH)
      data: data ? (data as string) : "0x", // Transaction data (default: empty)
    };

    const gasLimit = await provider.estimateGas(transaction); // Estimate gas limit

    // Fetch the fee data (baseFee and priorityFee)
    const feeData = await provider.getFeeData();

    if (!feeData || !feeData.gasPrice || !feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
      return res.status(500).json({ error: "Failed to fetch fee data from the provider" });
    }

    // Use maxFeePerGas if available (EIP-1559 chains), otherwise fallback to gasPrice
    const gasPrice = feeData.maxFeePerGas || feeData.gasPrice;

    if (!gasPrice) {
      throw new Error("Failed to determine gas price");
    }

    // Calculate transaction fee in Wei (ETH's smallest unit)
    const transactionFeeWei = gasPrice * gasLimit;

    // Fetch ETH/USD price from CoinGecko
    const priceResponse = await fetch(COINGECKO_API);
    const priceData = await priceResponse.json();

    if (!priceData.ethereum || !priceData.ethereum.usd) {
      throw new Error("Failed to fetch ETH/USD price");
    }

    const ethToUsdRate = priceData.ethereum.usd;

    // Convert transaction fee to ETH
    const transactionFeeETH = ethers.formatUnits(transactionFeeWei, 18); // Convert Wei to ETH

    // Convert transaction fee to USD
    const transactionFeeUSD = (parseFloat(transactionFeeETH) * ethToUsdRate).toFixed(4);

    // Return the gas fees in ETH and USD
    res.status(200).json({
      chainName: config.name,
      gasPrice: `${ethers.formatUnits(gasPrice, "gwei")} Gwei`, // Format gas price as Gwei
      estimatedGasLimit: gasLimit.toString(),
      transactionFeeETH: `${transactionFeeETH} ${config.nativeCurrency.symbol}`,
      transactionFeeUSD: `$${transactionFeeUSD}`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

import React, { useState } from 'react';
import { ethers } from 'ethers';

const CHAIN_CONFIG = {
  11155111: {
    name: 'Sepolia',
    relayerUrl: 'http://localhost:3000/relay',
    contractAddress: process.env.CONTRACT_ADDRESS || "0x3d9562281217AD79D0d7e849B055AD3796ea80e7"
  }
};

// Updated ABI to match the new contract
const GIFT_ABI = [
  "function getNonce(address user) view returns (uint256)",
  "function claimGift(uint256 giftId, uint256 estimateAmount, uint256 deadline, bytes memory signature) external",
];

const Signature = ({ chainId, giftId }: { chainId: number, giftId: string | number }) => {
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [estimateAmount, setEstimateAmount] = useState('0');

  const claimGift = async () => {
    setIsLoading(true);
    setError('');
    setStatus('');
    setTxHash('');

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another web3 wallet');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Ensure we're on the correct network
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(chainId)) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      }

      const contractAddress = CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG]?.contractAddress;
      if (!contractAddress) {
        throw new Error('Invalid chain configuration');
      }

      const contract = new ethers.Contract(contractAddress, GIFT_ABI, signer);
      const claimer = await signer.getAddress();
      const nonce = await contract.getNonce(claimer);
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      const domain = {
        name: "GiftV4",
        version: "1",
        chainId: chainId,
        verifyingContract: contractAddress,
      };

      const types = {
        ClaimGift: [
          { name: "giftId", type: "uint256" },
          { name: "estimateAmount", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const value = {
        giftId: BigInt(giftId),
        estimateAmount: BigInt(estimateAmount),
        nonce: BigInt(nonce),
        deadline: BigInt(deadline),
      };

      setStatus('Requesting signature...');
      const signature = await signer.signTypedData(domain, types, value);

      console.log('Signature Data:', {
        signature,
        domain,
        types,
        value,
        claimer,
        nonce: nonce.toString(),
        deadline,
      });

      setStatus('Submitting to relayer...');
      const response = await fetch(CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG].relayerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chainId,
          giftId: giftId.toString(),
          estimateAmount,
          deadline: deadline.toString(),
          signature,
          claimer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Relayer request failed');
      }

      const { txHash } = await response.json();
      setTxHash(txHash);
      setStatus('Transaction submitted successfully');
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Transaction failed');
      setStatus('Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Estimate Amount (in wei)
        </label>
        <input
          type="text"
          value={estimateAmount}
          onChange={(e) => setEstimateAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter estimate amount"
        />
      </div>
      <button
        onClick={claimGift}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {isLoading ? 'Processing...' : 'Claim Gift'}
      </button>
      
      {status && (
        <p className="mt-2 text-sm text-gray-600">{status}</p>
      )}
      
      {txHash && (
        <p className="mt-2 text-sm">
          Transaction Hash:{' '}
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {txHash}
          </a>
        </p>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Signature;
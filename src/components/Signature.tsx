import React, { useState } from 'react';
import { ethers } from 'ethers';

const CHAIN_CONFIG = {
  11155111: {
    name: 'Sepolia',
    relayerUrl: 'http://localhost:3000/relay',
    contractAddress: process.env.CONTRACT_ADDRESS || "0xD617F51369e59b83927D5e2FB20Cb3808eC969C2"
  }
};

const GIFT_ABI = [
  "function getNonce(address user) view returns (uint256)",
  "function claimGiftWithSig(uint256 giftId, uint256 deadline, bytes memory signature) external",
];

const Signature = ({ chainId, giftId }: { chainId: number, giftId: string | number }) => {
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const value = {
        giftId: BigInt(giftId),
        nonce: BigInt(nonce),
        deadline: BigInt(deadline),
      };

      setStatus('Requesting signature...');
      const signature = await signer.signTypedData(domain, types, value);

      setStatus('Submitting to relayer...');
      const response = await fetch(CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG].relayerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chainId,
          giftId: giftId.toString(),
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
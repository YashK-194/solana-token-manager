"use client";

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";

export default function TokenBalance({
  mintAddress,
  tokenName,
  tokenSymbol,
  decimals = 9,
}) {
  // Set up connection and wallet
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  // State variables
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Function to fetch token balance
    const fetchBalance = async () => {
      if (!publicKey || !mintAddress) {
        setBalance(null);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        // Get token account address
        const mint = new PublicKey(mintAddress);
        const tokenAccountAddress = await getAssociatedTokenAddress(
          mint,
          publicKey
        );

        try {
          // Get token account info
          const tokenAccount = await getAccount(
            connection,
            tokenAccountAddress
          );
          // Convert amount using decimals
          const amount = Number(tokenAccount.amount) / Math.pow(10, decimals);
          setBalance(amount);
        } catch (err) {
          // Token account doesn't exist yet, which means the user has 0 balance
          setBalance(0);
        }
      } catch (err) {
        console.error("Error fetching token balance:", err);
        setError(`Failed to get balance: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch and set up refresh interval
    fetchBalance();
    const intervalId = setInterval(fetchBalance, 10000);

    // Clean up interval
    return () => clearInterval(intervalId);
  }, [connection, publicKey, mintAddress, decimals]);

  // Don't render anything if wallet not connected or no mint address
  if (!publicKey || !mintAddress) {
    return null;
  }

  return (
    // Token balance container
    <div className="p-3 border border-gray-900 rounded bg-gray-900 mb-4">
      <div className="flex justify-between">
        {/* Token info */}
        <div>
          <p className="font-medium">{tokenName || "Token"}</p>
          <p className="text-xs text-gray-500">
            Symbol: {tokenSymbol || mintAddress.substring(0, 8)}
          </p>
        </div>
        {/* Token balance */}
        <div className="text-right">
          {isLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            <p className="font-medium">
              {balance?.toLocaleString()} {tokenSymbol}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

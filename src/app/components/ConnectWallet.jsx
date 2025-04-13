"use client";
// Import Solana wallet components
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function ConnectWallet() {
  // Get connection and wallet info
  const { connection } = useConnection(); // RPC connection
  const { publicKey } = useWallet();
  // Track wallet balance
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // Function to get wallet balance
    const getBalance = async () => {
      if (!publicKey) {
        setBalance(null);
        return;
      }

      try {
        // Get and convert balance from lamports to SOL
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
      }
    };

    // Get balance initially and set refresh interval
    getBalance();
    const intervalId = setInterval(getBalance, 10000);

    // Clean up interval
    return () => clearInterval(intervalId);
  }, [connection, publicKey]);

  return (
    // Container for wallet UI
    <div className="p-4 mb-6 border border-gray-900 rounded-lg bg-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Wallet connect button */}
        <WalletMultiButton />
        {/* Show address and balance when connected */}
        {publicKey && (
          <div className="text-sm">
            <p>
              <span className="font-medium">Address:</span>{" "}
              {publicKey.toString()}
            </p>
            <p>
              <span className="font-medium">SOL Balance:</span>{" "}
              {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

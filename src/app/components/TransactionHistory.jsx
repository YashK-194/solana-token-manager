"use client";

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export default function TransactionHistory() {
  // Set up connection and wallet
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  // State variables
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Function to fetch transaction history
    const fetchTransactionHistory = async () => {
      if (!publicKey) {
        setTransactions([]);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        // Fetch recent transactions for the user's address
        const transactionList = await connection.getSignaturesForAddress(
          publicKey,
          {
            limit: 10, // Get the 10 most recent transactions
          }
        );

        // Get detailed information on each transaction
        const detailedTransactions = await Promise.all(
          transactionList.map(async (tx) => {
            try {
              const txInfo = await connection.getTransaction(tx.signature);

              // Determine transaction type (a simplified approach)
              let type = "Unknown";
              if (txInfo?.meta?.logMessages) {
                const logs = txInfo.meta.logMessages.join(" ");
                if (logs.includes("Initialize mint")) {
                  type = "Create Token";
                } else if (logs.includes("Mint to")) {
                  type = "Mint Token";
                } else if (
                  logs.includes("Transfer") ||
                  logs.includes("transfer")
                ) {
                  type = "Transfer";
                }
              }

              return {
                signature: tx.signature,
                timestamp: new Date(tx.blockTime * 1000).toLocaleString(),
                status: tx.err ? "Failed" : "Success",
                type,
              };
            } catch (err) {
              console.error("Error fetching transaction details:", err);
              return {
                signature: tx.signature,
                timestamp: new Date(tx.blockTime * 1000).toLocaleString(),
                status: "Unknown",
                type: "Unknown",
              };
            }
          })
        );

        setTransactions(detailedTransactions);
      } catch (err) {
        console.error("Error fetching transaction history:", err);
        setError(`Failed to get transaction history: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch and set up refresh interval
    fetchTransactionHistory();
    // Update every 30 seconds
    const intervalId = setInterval(fetchTransactionHistory, 30000);

    // Clean up interval
    return () => clearInterval(intervalId);
  }, [connection, publicKey]);

  // Helper function to truncate long signatures
  const truncateSignature = (signature) => {
    if (signature.length <= 10) return signature;
    return `${signature.substring(0, 6)}...${signature.substring(
      signature.length - 4
    )}`;
  };

  if (isLoading) {
    return (
      <div className="p-4 border border-gray-900 rounded-lg bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="flex justify-center">
          <p className="text-gray-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-gray-900 rounded-lg bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="p-3 border border-red-800 rounded bg-red-900/20 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-900 rounded-lg bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-300">
                  Type
                </th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-300">
                  Time
                </th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-300">
                  Status
                </th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-300">
                  Signature
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {transactions.map((tx, index) => (
                <tr key={index} className="hover:bg-gray-700/30">
                  <td className="py-2 px-3 text-sm">{tx.type}</td>
                  <td className="py-2 px-3 text-sm">{tx.timestamp}</td>
                  <td className="py-2 px-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        tx.status === "Success"
                          ? "bg-green-800/30 text-green-400"
                          : tx.status === "Failed"
                          ? "bg-red-800/30 text-red-400"
                          : "bg-gray-800/30 text-gray-400"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-sm">
                    <a
                      href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {truncateSignature(tx.signature)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No transactions found</p>
      )}
    </div>
  );
}

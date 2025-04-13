"use client";
// Import required dependencies
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import TokenBalance from "./TokenBalance";

export default function TokenList() {
  // Get wallet connection
  const { publicKey } = useWallet();
  // State to track added tokens
  const [tokens, setTokens] = useState([]);
  // Form input states
  const [newTokenAddress, setNewTokenAddress] = useState("");
  const [newTokenName, setNewTokenName] = useState("");
  const [newTokenSymbol, setNewTokenSymbol] = useState("");
  const [newTokenDecimals, setNewTokenDecimals] = useState(9);

  // Handle adding a new token to watch list
  const handleAddToken = (e) => {
    e.preventDefault();

    const newToken = {
      address: newTokenAddress,
      name: newTokenName || "Unknown Token",
      symbol: newTokenSymbol || "TOKEN",
      decimals: parseInt(newTokenDecimals),
    };

    setTokens([...tokens, newToken]);
    // Reset form inputs
    setNewTokenAddress("");
    setNewTokenName("");
    setNewTokenSymbol("");
    setNewTokenDecimals(9);
  };

  // Show message if wallet not connected
  if (!publicKey) {
    return (
      <div className="p-4 mb-6 border border-gray-900 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Your Tokens</h2>
        <p className="text-gray-500">Connect your wallet to view tokens</p>
      </div>
    );
  }

  return (
    <div className="p-4 mb-6 border border-gray-900 rounded-lg bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">Your Tokens</h2>

      {/* Display tokens or empty message */}
      {tokens.length > 0 ? (
        <div className="space-y-2 mb-6">
          {tokens.map((token, index) => (
            <TokenBalance
              key={index}
              mintAddress={token.address}
              tokenName={token.name}
              tokenSymbol={token.symbol}
              decimals={token.decimals}
            />
          ))}
        </div>
      ) : (
        <p className="mb-4 text-gray-500">No tokens added yet</p>
      )}

      {/* Add token form */}
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Add Token to Watch</h3>
        <form onSubmit={handleAddToken}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Token Address:
            </label>
            <input
              type="text"
              value={newTokenAddress}
              onChange={(e) => setNewTokenAddress(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter token mint address"
              required
            />
          </div>

          {/* Form fields for token details */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Name (Optional):
              </label>
              <input
                type="text"
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="My Token"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Symbol (Optional):
              </label>
              <input
                type="text"
                value={newTokenSymbol}
                onChange={(e) => setNewTokenSymbol(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="TKN"
              />
            </div>

            <div className="w-24">
              <label className="block text-sm font-medium mb-1">
                Decimals:
              </label>
              <input
                type="number"
                value={newTokenDecimals}
                onChange={(e) => setNewTokenDecimals(e.target.value)}
                className="w-full p-2 border rounded"
                min="0"
                max="9"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-blue-500 text-white py-1 px-3 text-sm rounded hover:bg-blue-600"
          >
            Add Token
          </button>
        </form>
      </div>
    </div>
  );
}

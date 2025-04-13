"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createMintToCheckedInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";

export default function MintToken() {
  // Set up connection and wallet
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // Form state variables
  const [mintAddress, setMintAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [decimals, setDecimals] = useState(9);
  const [isMinting, setIsMinting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Handle token minting
  const handleMintToken = async (e) => {
    e.preventDefault();

    // Check wallet connection
    if (!publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    setError("");
    setSuccess("");
    setIsMinting(true);

    try {
      console.log("Starting mint process");

      // Parse the mint address
      const mintPublicKey = new PublicKey(mintAddress);
      console.log("Mint address:", mintPublicKey.toString());

      // Get the associated token address
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );
      console.log(
        "Associated token address:",
        associatedTokenAddress.toString()
      );

      // Start building transaction
      const transaction = new Transaction();

      // Check if token account exists
      let tokenAccountExists = false;
      try {
        const accountInfo = await connection.getAccountInfo(
          associatedTokenAddress
        );
        tokenAccountExists = !!accountInfo;
        console.log("Token account exists:", tokenAccountExists);
      } catch (err) {
        console.log("Error checking token account:", err.message);
        tokenAccountExists = false;
      }

      // Create token account if needed
      if (!tokenAccountExists) {
        console.log("Adding create token account instruction");
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            associatedTokenAddress, // associated token account
            publicKey, // owner
            mintPublicKey // mint
          )
        );
      }

      // Calculate amount with decimal precision
      const amountToMint = BigInt(
        Math.floor(Number(amount) * Math.pow(10, decimals))
      );
      console.log("Amount to mint:", amountToMint.toString());

      // Add mint instruction
      console.log("Adding mint instruction");
      transaction.add(
        createMintToCheckedInstruction(
          mintPublicKey,
          associatedTokenAddress,
          publicKey,
          amountToMint,
          decimals
        )
      );

      console.log("Transaction built, sending...");
      // Set transaction parameters
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      // Send transaction
      console.log("Sending transaction");
      const signature = await sendTransaction(transaction, connection);
      console.log("Transaction sent, signature:", signature);

      // Confirm transaction
      console.log("Confirming transaction");
      const confirmation = await connection.confirmTransaction({
        signature,
        commitment: "confirmed",
      });
      console.log("Transaction confirmed:", confirmation);

      // Set success state
      setSuccess({
        message: `Successfully minted ${amount} tokens!`,
        signature: signature,
      });
    } catch (err) {
      console.error("Error in mint process:", err);

      // Error handling
      let errorMessage = err.message;
      if (err.name === "WalletSendTransactionError") {
        errorMessage = `Wallet error: ${err.message}. Make sure you are the mint authority for this token.`;
      }

      setError(`Failed to mint tokens: ${errorMessage}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    // UI container
    <div className="p-4 mb-6 border border-gray-900 rounded-lg bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">Mint Tokens</h2>

      {/* Token minting form */}
      <form onSubmit={handleMintToken}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Token Address:
          </label>
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter token mint address"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Amount to Mint:
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="1000"
            required
            min="0"
            step="any"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Token Decimals:
          </label>
          <input
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
            className="w-full p-2 border rounded"
            min="0"
            max="9"
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!publicKey || isMinting}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isMinting ? "Minting..." : "Mint Tokens"}
        </button>
      </form>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-600">{success.message}</p>
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Transaction Signature:</p>
            <div className="flex items-center">
              <div className="bg-gray-900 p-2 rounded overflow-x-auto max-w-full">
                <code className="text-xs text-blue-700 break-all">
                  {success.signature}
                </code>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(success.signature);
                  alert("Signature copied to clipboard!");
                }}
                className="ml-2 p-1 bg-blue-100 rounded hover:bg-blue-200"
                title="Copy to clipboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info message */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-600">
          <strong>Note:</strong> You can only mint tokens if you are the mint
          authority for the token. Make sure you're using the correct token
          address and that your wallet has permission to mint.
        </p>
      </div>
    </div>
  );
}

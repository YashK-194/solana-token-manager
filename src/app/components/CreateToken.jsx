"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { Keypair, Transaction } from "@solana/web3.js";

export default function CreateToken() {
  // Set up connection and wallet
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // Form state variables
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimals, setDecimals] = useState(9);
  const [isCreating, setIsCreating] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [error, setError] = useState("");

  // Handle token creation
  const handleCreateToken = async (e) => {
    e.preventDefault();

    // Check wallet connection
    if (!publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    setError("");
    setIsCreating(true);

    try {
      // Generate mint account keypair
      const mintKeypair = Keypair.generate();

      // Calculate rent exemption
      const lamports = await connection.getMinimumBalanceForRentExemption(82);

      // Create transaction
      const transaction = new Transaction().add(
        // Create account instruction
        require("@solana/web3.js").SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: 82,
          lamports,
          programId: require("@solana/spl-token").TOKEN_PROGRAM_ID,
        }),

        // Initialize mint instruction
        require("@solana/spl-token").createInitializeMintInstruction(
          mintKeypair.publicKey,
          decimals,
          publicKey,
          publicKey
        )
      );

      // Send transaction
      const signature = await sendTransaction(transaction, connection, {
        signers: [mintKeypair],
      });

      await connection.confirmTransaction(signature, "confirmed");

      // Store the mint address first
      const mintAddress = mintKeypair.publicKey.toString();
      console.log(`Token mint created successfully: ${mintAddress}`);

      try {
        // Create associated token account in a separate try/catch block
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          {
            publicKey,
            secretKey: null,
            sendTransaction: async (transaction, connection, options) => {
              return await sendTransaction(transaction, connection, options);
            },
          },
          mintKeypair.publicKey,
          publicKey
        );

        console.log(`Token account: ${tokenAccount.address.toString()}`);
      } catch (tokenAccountErr) {
        // Even if token account creation fails, the mint was still created successfully
        console.warn(
          "Note: Associated token account might not be created yet:",
          tokenAccountErr
        );
      }

      // Set token address to the mint address, not the token account address
      setTokenAddress(mintAddress);
    } catch (err) {
      console.error("Error creating token:", err);

      // Error handling
      let errMsg = "Unknown error";

      if (err instanceof Error) {
        errMsg = err.message;
      } else if (typeof err === "string") {
        errMsg = err;
      } else if (err?.toString) {
        errMsg = err.toString();
      }

      if (!tokenAddress) {
        setError(`Failed to create token: ${errMsg}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    // UI container
    <div className="p-4 mb-6 border border-gray-900 rounded-lg bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">Create New Token</h2>

      {/* Token creation form */}
      <form onSubmit={handleCreateToken}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Token Name:</label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="My Token"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Token Symbol:
          </label>
          <input
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="TKN"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Decimals:</label>
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
          disabled={!publicKey || isCreating}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isCreating ? "Creating..." : "Create Token"}
        </button>
      </form>

      {/* Error message */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Success message */}
      {tokenAddress && (
        <div className="mt-4 p-3 bg-gray-900 border border-gray-700 rounded text-white">
          <p className="font-medium">Token created successfully!</p>
          <p className="text-sm break-all">
            Token Address:{" "}
            <a
              href={`https://explorer.solana.com/address/${tokenAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {tokenAddress}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

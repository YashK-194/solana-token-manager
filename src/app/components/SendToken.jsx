"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";

export default function SendToken() {
  // Set up connection and wallet
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  // Form state variables
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [decimals, setDecimals] = useState(9);
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Handle token sending
  const handleSendToken = async (e) => {
    e.preventDefault();

    // Check wallet connection
    if (!connected) {
      setError("Wallet is not connected. Please reconnect your wallet.");
      return;
    }

    if (!publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    setError("");
    setSuccess("");
    setIsSending(true);

    try {
      // Parse addresses
      const mintPublicKey = new PublicKey(tokenAddress);
      const recipientPublicKey = new PublicKey(recipientAddress);

      // Get sender's token account address
      const senderTokenAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );

      // Get recipient's token account address
      const recipientTokenAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        recipientPublicKey
      );

      // Create transaction
      const transaction = new Transaction();

      // Check if recipient's token account exists
      let recipientAccountExists = false;
      try {
        const accountInfo = await connection.getAccountInfo(
          recipientTokenAddress
        );
        recipientAccountExists = !!accountInfo;
      } catch (err) {
        recipientAccountExists = false;
      }

      // If recipient token account doesn't exist, create it
      if (!recipientAccountExists) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            recipientTokenAddress, // associated token account address
            recipientPublicKey, // owner
            mintPublicKey // mint
          )
        );
      }

      // Calculate the amount to send based on decimals
      const amountToSend = BigInt(
        Math.floor(Number(amount) * Math.pow(10, decimals))
      );

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          senderTokenAddress, // source
          recipientTokenAddress, // destination
          publicKey, // owner of source
          amountToSend // amount
        )
      );

      // Set recent blockhash and fee payer
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction({
        signature,
        commitment: "confirmed",
      });

      // Set success message
      setSuccess({
        message: `Successfully sent ${amount} tokens to ${recipientAddress.substring(
          0,
          8
        )}...`,
        signature: signature,
      });
    } catch (err) {
      console.error("Error sending tokens:", err);
      setError(`Failed to send tokens: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    // UI container
    <div className="p-4 mb-6 border border-gray-900 rounded-lg bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">Send Tokens</h2>

      {/* Token sending form */}
      <form onSubmit={handleSendToken}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Token Address:
          </label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter token mint address"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Recipient Address:
          </label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter recipient wallet address"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Amount to Send:
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="100"
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
          disabled={!publicKey || isSending}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isSending ? "Sending..." : "Send Tokens"}
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
              <div className="bg-gray-100 p-2 rounded overflow-x-auto max-w-full">
                <a
                  href={`https://explorer.solana.com/tx/${success.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-500"
                >
                  <code className="text-xs break-all">{success.signature}</code>
                </a>
              </div>
              {/* Copy to clipboard button */}
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

      {/* Information note */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-600">
          <strong>Note:</strong> Sending tokens requires the recipient to have a
          token account for the specific token. This component will
          automatically create the token account if it doesn't exist yet.
        </p>
      </div>
    </div>
  );
}

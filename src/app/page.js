// Main page component for the Solana token manager app
"use client";
// Import token component modules
import ConnectWallet from "./components/ConnectWallet";
import CreateToken from "./components/CreateToken";
import MintToken from "./components/MintToken";
import SendToken from "./components/SendToken";
import TokenList from "./components/TokenList";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  // Get wallet connection state
  const { publicKey } = useWallet();
  // Track active tab for navigation
  const [activeTab, setActiveTab] = useState("dashboard");

  // Define navigation tabs
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "create", label: "Create Token" },
    { id: "mint", label: "Mint Token" },
    { id: "send", label: "Send Token" },
  ];

  return (
    // Main container with gradient background
    <div className="min-h-screen bg-gradient-to-br from-black-700 via-gray-800 to-gray-900">
      <div className="container mx-auto p-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-100">
          Solana SPL Token Manager
        </h1>
        {/* Wallet connection component */}
        <ConnectWallet />

        {/* Show tabs and content only when wallet is connected */}
        {publicKey && (
          <>
            {/* Navigation tabs */}
            <div className="mb-6 bg-gray-800/40 rounded-lg backdrop-blur-sm p-2">
              <div className="border-b border-gray-700 flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`py-2 px-4 font-medium ${
                      activeTab === tab.id
                        ? "border-b-2 border-blue-500 text-blue-400"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content area - display selected component */}
            <div className="mb-6 bg-gray-800/30 p-6 rounded-xl shadow-md backdrop-blur-sm">
              {activeTab === "dashboard" && <TokenList />}
              {activeTab === "create" && <CreateToken />}
              {activeTab === "mint" && <MintToken />}
              {activeTab === "send" && <SendToken />}
            </div>
          </>
        )}

        {/* Page footer */}
        <footer className="mt-12 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>Solana SPL Token Frontend • Created by Yash Kumar</p>
        </footer>
      </div>
    </div>
  );
}

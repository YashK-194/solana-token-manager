// Wallet context provider for Solana integration
"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

// Import wallet adapter styles
require("@solana/wallet-adapter-react-ui/styles.css");

export default function WalletContextProvider({ children }) {
  // Set network to Devnet for development
  const network = WalletAdapterNetwork.Devnet;

  // Get RPC endpoint URL for the selected network
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Configure supported wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    // Set up connection provider with endpoint
    <ConnectionProvider endpoint={endpoint}>
      {/* Set up wallet provider with supported wallets */}
      <WalletProvider wallets={wallets} autoConnect>
        {/* Add modal for wallet selection */}
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

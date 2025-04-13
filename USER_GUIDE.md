# Solana SPL Token Manager - User Guide

This guide provides detailed instructions for using the Solana SPL Token Manager application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Connecting Your Wallet](#connecting-your-wallet)
3. [Creating a Token](#creating-a-token)
4. [Minting Tokens](#minting-tokens)
5. [Sending Tokens](#sending-tokens)
6. [Viewing Token Balances](#viewing-token-balances)
7. [Advanced Usage](#advanced-usage)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### System Requirements

- Modern web browser (Chrome, Firefox, Edge, or Safari)
- Solana wallet extension installed (Phantom, Solflare, etc.)
- Some SOL for transaction fees

### Accessing the Application

1. Launch the application by visiting the deployed URL or running it locally:

   - Local: http://localhost:3000
   - Production: [your-deployment-url]

2. You should see the application interface with a "Connect Wallet" button at the top.

## Connecting Your Wallet

1. Click the "Connect Wallet" button in the application.
2. A popup will appear with available wallet options.
3. Select your preferred wallet (e.g., Phantom, Solflare).
4. Approve the connection request in your wallet extension.
5. Once connected, the button will change to show your wallet address.
6. Your SOL balance will be displayed below your address.

## Creating a Token

The "Create Token" tab allows you to create your own Solana SPL token:

1. Navigate to the "Create Token" tab.
2. Fill in the following information:

   - **Token Name**: The full name of your token (e.g., "My Awesome Token")
   - **Token Symbol**: A short abbreviation for your token (e.g., "MAT")
   - **Decimals**: The number of decimal places for your token (default: 9)
     - 9 decimals is standard for most tokens
     - 0 decimals creates a non-divisible token (like an NFT)
     - 2 decimals is common for stablecoin-like tokens

3. Click "Create Token" button.
4. Approve the transaction in your wallet extension.
5. Wait for the transaction to be confirmed on the blockchain.
6. Once created, a success message will appear with your token's mint address.
7. **Important**: Save your token mint address somewhere safe - you'll need it for minting and other operations.

### Token Creation Costs

Creating a token requires SOL for:

- Account rent (storage space on the blockchain)
- Transaction fees

Make sure you have at least 0.01 SOL in your wallet for this operation.

## Minting Tokens

After creating a token, you can mint additional tokens if you're the mint authority:

1. Navigate to the "Mint Token" tab.
2. Enter the following information:

   - **Token Address**: The mint address of your token
   - **Amount to Mint**: How many tokens you want to create
   - **Token Decimals**: Must match the decimals you specified when creating the token

3. Click "Mint Tokens" button.
4. Approve the transaction in your wallet extension.
5. Once confirmed, a success message will appear.

### Minting Permissions

Only the mint authority (the wallet that created the token) can mint new tokens. If you try to mint tokens for a token where you're not the mint authority, the transaction will fail.

## Sending Tokens

To send tokens to another address:

1. Navigate to the "Send Token" tab.
2. Enter the following information:

   - **Token**: Select the token you want to send from the dropdown
   - **Recipient**: The Solana address of the recipient
   - **Amount**: How many tokens you want to send

3. Click "Send Tokens" button.
4. Approve the transaction in your wallet extension.
5. Once confirmed, a success message will appear.

### Fee Notes

Sending tokens requires a small amount of SOL for the transaction fee. Additionally, if the recipient doesn't have a token account for this specific token, one will be created automatically (requiring additional SOL).

## Viewing Token Balances

The "Dashboard" tab shows all tokens in your wallet:

1. Navigate to the "Dashboard" tab.
2. You'll see a list of all SPL tokens in your wallet.
3. For each token, the following information is displayed:
   - Token name (if available)
   - Token symbol (if available)
   - Token address (mint)
   - Your balance

If you don't see a token that you expect, it may be because:

- The token transaction hasn't been confirmed yet
- The token uses a different network than you're currently on
- You have no balance of that token

## Advanced Usage

### Working with Different Networks

The application defaults to Solana's devnet. To work with tokens on mainnet or testnet:

1. Make sure your wallet is connected to the desired network:

   - In Phantom: Click on the network name at the top of the wallet
   - In Solflare: Open settings and select the network

2. If you have deployed your own version of this application, modify the WalletContextProvider.js file to point to the correct network.

### Creating NFT-like Tokens

To create a non-fungible token (similar to an NFT):

1. Create a token with 0 decimals
2. Mint only 1 of the token
3. Disable mint authority (this feature requires additional code)

## Troubleshooting

### Common Errors

#### "Transaction Simulation Failed"

This usually means one of:

- Insufficient SOL for transaction fees
- You don't have permission to perform the action (e.g., minting a token when you're not the mint authority)
- The token account doesn't exist

Solution: Check your SOL balance and verify permissions.

#### "Invalid Token Address"

This occurs when the token mint address entered is not a valid Solana address.

Solution: Double-check the token address for typos.

#### "Token Account Not Found"

This happens when trying to send or check the balance of a token that you don't have an account for.

Solution: You need to receive some of this token first for an account to be created.

### Getting Help

If you encounter issues not covered in this guide:

1. Check the console for error messages (Press F12 in your browser to open developer tools)
2. Verify your wallet is connected to the correct network
3. Ensure you have sufficient SOL for transaction fees
4. Try refreshing the page and reconnecting your wallet

---

_Last updated: April 13, 2025_

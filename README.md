# Solana SPL Token Manager

A Next.js application for managing Solana SPL tokens directly from your browser. This application allows users to connect their Solana wallet and perform various operations with SPL tokens including creating tokens, minting tokens, sending tokens, and viewing token balances.

![Solana SPL Token Manager](https://solana.com/branding/new/logo/clusters/mainnet-beta/mark/external/digital/medium/png/mark-only-on-dark.png)

## Features

- **Wallet Connection**: Connect to any Solana wallet using the Wallet Adapter protocol
- **Token Creation**: Create new SPL tokens with custom parameters
- **Token Minting**: Mint additional tokens to your wallet
- **Token Transfers**: Send tokens to other Solana addresses
- **Token Dashboard**: View all tokens in your wallet with balances

## Tech Stack

- **Frontend Framework**: Next.js 15.3.0
- **React**: React 19.0.0
- **Styling**: Tailwind CSS 4
- **Blockchain**: Solana Web3.js
- **Token Standard**: Solana SPL Token
- **Wallet Integration**: Solana Wallet Adapter

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- A Solana wallet (Phantom, Solflare, etc.)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/solana-frontend.git
   cd solana-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
  app/
    components/
      ConnectWallet.jsx     # Wallet connection component
      CreateToken.jsx       # Form for creating new SPL tokens
      MintToken.jsx         # Interface for minting tokens
      SendToken.jsx         # Interface for sending tokens to other addresses
      TokenBalance.jsx      # Display token balance information
      TokenList.jsx         # List of tokens in the wallet
    providers/
      WalletContextProvider.js  # Provides wallet context to the application
    page.js                 # Main page component
    layout.js               # Root layout
    globals.css             # Global styles
```

## Component Details

### ConnectWallet.jsx

Handles connecting to a Solana wallet using the Wallet Adapter. Displays wallet address and SOL balance once connected.

### CreateToken.jsx

Provides a form to create new SPL tokens with:

- Token Name
- Token Symbol
- Decimal Places (default: 9)

The component handles the creation of the token mint and optionally creates an associated token account for the user.

### MintToken.jsx

Allows users to mint additional tokens if they are the mint authority:

- Input for token mint address
- Amount to mint
- Token decimals

### SendToken.jsx

Enables sending tokens to other Solana addresses:

- Token selection
- Recipient address
- Amount to send

### TokenList.jsx

Displays all SPL tokens in the connected wallet with:

- Token name
- Symbol
- Address
- Balance

### TokenBalance.jsx

Component for displaying individual token balance information.

## Usage

1. **Connect Your Wallet**

   - Click on the "Connect Wallet" button
   - Select your Solana wallet from the available options

2. **Create a New Token**

   - Navigate to the "Create Token" tab
   - Enter token details (name, symbol, decimals)
   - Click "Create Token"
   - The new token mint address will be displayed upon successful creation

3. **Mint Tokens**

   - Navigate to the "Mint Token" tab
   - Enter the token mint address
   - Specify the amount to mint and decimals
   - Note: You must be the mint authority for the token

4. **Send Tokens**

   - Navigate to the "Send Token" tab
   - Enter the recipient's Solana address
   - Select the token and amount to send
   - Confirm the transaction in your wallet

5. **View Your Tokens**
   - The "Dashboard" tab shows all tokens in your wallet
   - View balances and token details

## Network Configuration

The application is configured to connect to Solana's devnet by default. To change the network:

1. Modify the cluster connection in the WalletContextProvider.js file
2. Update the clusterApiUrl parameter to one of:
   - `mainnet-beta` (Production)
   - `devnet` (Development)
   - `testnet` (Testing)

## Development

### Available Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

### Adding New Features

To add new features to this application:

1. Create new components in the `src/app/components` directory
2. Import and use Solana Web3.js and SPL Token libraries as needed
3. Update the main page to include your new features

## Troubleshooting

### Common Issues

1. **Wallet Connection Failed**

   - Make sure your wallet extension is installed and unlocked
   - Check if you're connected to the right Solana network

2. **Transaction Failures**

   - Ensure you have enough SOL for transaction fees
   - Verify you have the required permissions for token operations
   - Check browser console for detailed error messages

3. **Token Balance Not Showing**
   - Token accounts are created automatically when receiving tokens
   - Some tokens may require manual account creation

## License

This project is open source and available under the [MIT License](LICENSE).

## Created By

Solana SPL Token Frontend • Created by Yash Kumar

---

_Last updated: April 13, 2025_

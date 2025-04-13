import "./globals.css";
import WalletContextProvider from "./providers/WalletContextProvider";

export const metadata = {
  title: "Solana Token Manager",
  description: "A web application to manage Solana tokens",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}

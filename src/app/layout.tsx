import type { Metadata } from "next";
import "./globals.css";
import { AddressProvider } from "@/context/MetaMaskProvider";
import Header from "@/components/shared/Header";
export const metadata: Metadata = {
  title: "Hyperliquid Airdrop ",
  description: "Hyperliquid airdrop, check your PNL, portfolio, volume and more.",
};
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AddressProvider>
          <Header />
          <div className='flex-1 m-auto py-4 w-full'>
            {children}
          </div>
          <Toaster />
        </AddressProvider>
      </body>
    </html>
  );
}

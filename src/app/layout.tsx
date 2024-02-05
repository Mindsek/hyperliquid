import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AddressProvider } from "@/context/MetaMaskProvider";
const inter = Inter({ subsets: ["latin"] });
import Header from "@/components/shared/Header";
export const metadata: Metadata = {
  title: "Hyperliquid Viewer ",
  description: "Hyperliquid Viewer, check your PNL, portfolio, volume and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AddressProvider>
          <Header />
          <div className='flex-1 m-auto py-4 w-full'>
            {children}
          </div>
        </AddressProvider>
      </body>
    </html>
  );
}

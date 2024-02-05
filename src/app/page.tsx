"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then((res) => res.json());
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
// "positions": [{
//   "asset": "ETH",
//   "positionValue": "1789.0875",
//   "marginUsed": "34.702253",
//   "leverage": 50,
//   "entryPx": "2307.6",
//   "liquidationPx": "2329.97732737",
//   "unrealizedPnl": "-0.6975"
// }]
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
export default function Home() {
  const { data, error } = useSWR('/api/balance', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-8">HYPERLIQUID Balances</h1>
      <section className="grid md:grid-cols-2 gap-4 w-[90%] mx-auto">

        {
          data.map((wallet: any) => (
            <Card key={wallet.address} className="">
              <CardHeader>
                <CardTitle>Address: {wallet.address}</CardTitle>
                <CardDescription>Total Balance: ${parseFloat(wallet.totalRawUsd).toFixed(2)} USD</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription>Open Positions:</CardDescription>
                {wallet.positions.length > 0 ? (
                  <ul>
                    {wallet.positions.map((position: any, index: number) => (
                      <li key={index} className="">
                        {position.asset}: ${parseFloat(position.positionValue).toFixed(2)} USD (Leverage: {position.leverage}x)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No open positions</p>
                )}
              </CardContent>
              <CardFooter>
                {wallet.positions.length > 0 && wallet.positions.map((position: any, index: number) => (
                  <Table key={index}>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Position Value</TableHead>
                        <TableHead>Margin Used</TableHead>
                        <TableHead>Leverage</TableHead>
                        <TableHead>Entry Price</TableHead>
                        <TableHead>Liquidation Price</TableHead>
                        <TableHead>Unrealized PnL</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{position.asset}</TableCell>
                        <TableCell>{parseFloat(position.positionValue).toFixed(2)}</TableCell>
                        <TableCell>{parseFloat(position.marginUsed).toFixed(2)}</TableCell>
                        <TableCell>{position.leverage}</TableCell>
                        <TableCell>{position.entryPx}</TableCell>
                        <TableCell>{position.liquidationPx}</TableCell>
                        <TableCell>{position.unrealizedPnl}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ))}
              </CardFooter>
            </Card>
          ))
        }
      </section>

    </main>
  );
}
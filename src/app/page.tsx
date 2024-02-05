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
import useSWR from 'swr';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useAddress } from "@/context/MetaMaskProvider";
import FormAddress from "@/components/AddAddress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
export default function Home() {
    const shortAddress = (address: string) => {
        return address.substring(0, 5) + '...' + address.substring(address.length - 4, address.length);
    }
    const { data } = useAddress();
    const [priceEstimate, setPriceEstimate] = useState(0);
    const [volumeEstimate, setVolumeEstimate] = useState(0);
    return (
        <main className="flex flex-col min-h-screen items-center py-16 w-[90%] mx-auto">
            <div className="w-full max-w-lg">
                <FormAddress />
            </div>

            <div className="flex mt-4 w-full max-w-lg gap-4">
                <div className="flex flex-col w-full gap-1">
                    <Label>Estimation price</Label>
                    <Input
                        type="number"
                        placeholder="Enter your estimation price"
                        className="w-full"
                        value={priceEstimate}
                        onChange={(e) => setPriceEstimate(parseFloat(e.target.value))}
                    />
                </div>
                <div className="flex flex-col w-full gap-1">
                    <Label>Points/M Volume</Label>
                    <Input
                        type="number"
                        placeholder="Points/M Volume"
                        className="w-full"
                        value={volumeEstimate}
                        onChange={(e) => setVolumeEstimate(parseFloat(e.target.value))}
                    />
                </div>

            </div>

            <h1 className="text-5xl font-bold m-10">
                <span className="text-primary">HYPERLIQUID</span> Balances
            </h1>

            {
                data && (
                    <section className="grid lg:grid-cols-2 gap-4 w-[90%] mx-auto">

                        {
                            data.map((wallet: any, index: any) => {
                                const volume = parseFloat(wallet.portfolioValue).toFixed(2);
                                const volumeUsd = parseFloat(wallet.portfolioValue).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                });

                                const lastPnl = parseFloat(wallet.lastPnl).toFixed(2);
                                const address = shortAddress(wallet.address);
                                const totalRawUsd = parseFloat(wallet.totalRawUsd).toFixed(2);
                                const PnlFor1million = parseFloat(lastPnl) > 0 ? (parseFloat(lastPnl) * 1000000 / parseFloat(volume)).toFixed(2) : (parseFloat(lastPnl) * -1 * 1000000 / parseFloat(volume)).toFixed(2);
                                return (
                                    <Card key={address} className="bg-muted relative">
                                        <CardHeader className="w-[80%]">
                                            <CardTitle>Hyperliquid {index + 1}: {address}</CardTitle>
                                            <CardDescription>
                                                Volume: <span className="text-primary">${volumeUsd}</span> USD
                                            </CardDescription>
                                            <CardDescription>Balance: <span className="text-primary">${totalRawUsd}</span> USD</CardDescription>
                                            <CardDescription>PNL: <span className="text-primary">${lastPnl}</span> USD</CardDescription>
                                            <CardDescription>Estimation PNL/1M: <span className="text-primary">${PnlFor1million}</span> USD</CardDescription>
                                            <div className="">
                                                {
                                                    <p className="text-xl lg:text-3xl">
                                                        Airdrop: <span className="text-primary font-extrabold">
                                                            ${(parseFloat(volume) / 1000000 * (priceEstimate * volumeEstimate)).toFixed(2)}
                                                        </span>
                                                    </p>
                                                }
                                                {
                                                    <p className="text-xl lg:text-3xl">
                                                        Value Net: <span className="text-primary font-extrabold">
                                                            ${((parseFloat(volume) / 1000000 * (priceEstimate * volumeEstimate)) + parseFloat(lastPnl)).toFixed(2)}
                                                        </span>
                                                    </p>
                                                }
                                            </div>
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
                                                            <TableCell>{position.unrealizedPnl}%</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            ))}
                                        </CardFooter>
                                    </Card>
                                )
                            }
                            )
                        }
                    </section>
                )
            }

        </main>
    );
}
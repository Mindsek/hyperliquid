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
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"
const fetcher = (url: string) => fetch(url).then((res) => res.json());
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
    const shortAddress = (address: string) => {
        return address.substring(0, 5) + '...' + address.substring(address.length - 4, address.length);
    }
    const { data, error } = useSWR('/api/stats', fetcher);
    const { toast } = useToast()
    const { balances } = useAddress();
    const [priceEstimate, setPriceEstimate] = useState(0);
    const [volumeEstimate, setVolumeEstimate] = useState(0);
    const [pointsUser, setPointsUser] = useState<any>({});
    // Supposons que `data` est un tableau d'objets de portefeuille, chaque objet contenant une clé `address`.
    const [switchPoints, setSwitchPoints] = useState<{ [address: string]: boolean }>({});
    useEffect(() => {
        // Assurez-vous que data n'est pas null avant de continuer
        if (balances) {
            const initialSwitchStates = balances.reduce((acc: { [address: string]: boolean }, wallet: any) => {
                acc[wallet.address] = false; // Initialise tous les commutateurs comme non cochés
                return acc;
            }, {});
            setSwitchPoints(initialSwitchStates);
        }
    }, [balances]);

    const handleSwitchChange = (address: string, checked: boolean) => {
        setSwitchPoints(prev => ({ ...prev, [address]: checked }));
    };

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
            {/* statistiques here 
            {
    "total_users": {
        "total_users": 52632
    },
    "total_deposits": {
        "total_deposits": 411431119.24924445
    }
}
            */}
            <div className="flex mt-4 w-full max-w-lg gap-4">
                <div className="flex flex-col w-full gap-1">
                    <Label>Total Users</Label>

                    <Button
                        className="w-full"
                        onClick={() => toast({ title: `Total Users: ${data?.total_users.total_users}` })}>
                        {
                            data?.total_users.total_users.toFixed(2)
                        }
                    </Button>
                </div>
                <div className="flex flex-col w-full gap-1">
                    <Label>Total Deposits</Label>
                    {/*
                    <Input
                        type="number"
                        placeholder="Total Deposits"
                        className="w-full"
                        value={data?.total_deposits.total_deposits.toFixed(2)}
                        disabled
                    /> */}
                    <Button
                        className="w-full"
                        onClick={() => toast({ title: `Total Deposits: ${data?.total_deposits.total_deposits.toFixed(2)}` })}>{data?.total_deposits.total_deposits.toFixed(2)}</Button>
                </div>
            </div>

            <h1 className="text-5xl font-bold m-10">
                <span className="text-primary">HYPERLIQUID</span> Airdrop
            </h1>

            {
                balances && (
                    <section className="grid lg:grid-cols-2 gap-4 w-[90%] mx-auto">

                        {
                            balances.map((wallet: any, index: any) => {
                                const volume = parseFloat(wallet.portfolioValue).toFixed(2);
                                const volumeUsd = parseFloat(wallet.portfolioValue).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                });

                                const lastPnl = parseFloat(wallet.lastPnl).toFixed(2);
                                const address = shortAddress(wallet.address);
                                const totalRawUsd = parseFloat(wallet.totalRawUsd).toFixed(2);
                                const PnlFor1million = parseFloat(lastPnl) > 0 ? (parseFloat(lastPnl) * 1000000 / parseFloat(volume)).toFixed(2) : (parseFloat(lastPnl) * -1 * 1000000 / parseFloat(volume)).toFixed(2);
                                const airdropValue = switchPoints[wallet.address]
                                    ? (pointsUser[wallet.address] || 0) * priceEstimate
                                    : (parseFloat(volume) / 1000000 * (priceEstimate * volumeEstimate));
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
                                            <Switch
                                                checked={switchPoints[wallet.address] || false}
                                                onCheckedChange={(checked) => handleSwitchChange(wallet.address, checked)}
                                            />

                                            {
                                                switchPoints[wallet.address] && (
                                                    <div className="flex flex-col gap-1">
                                                        <Label>Points</Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="Enter your points"
                                                            className="w-full"
                                                            // Supposons que vous ayez un état pour stocker les points par adresse
                                                            value={pointsUser[wallet.address] || 0}
                                                            onChange={(e) => setPointsUser({ ...pointsUser, [wallet.address]: parseFloat(e.target.value) })}
                                                        />
                                                    </div>
                                                )
                                            }

                                            <div className="">
                                                {
                                                    <p className="text-xl lg:text-3xl">
                                                        Airdrop: <span className="text-primary font-extrabold">
                                                            ${airdropValue.toFixed(2)}
                                                        </span>
                                                    </p>
                                                }
                                                {
                                                    <p className="text-xl lg:text-3xl">
                                                        Value Net: <span className="text-primary font-extrabold">
                                                            ${(airdropValue + parseFloat(lastPnl)).toFixed(2)}
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
                                        <CardFooter className="flex flex-col">
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

            <iframe src="https://app.hyperliquid.xyz/leaderboard" className="w-full h-[100vh] m-10 border-4 rounded-lg border-primary"></iframe>

        </main>
    );
}
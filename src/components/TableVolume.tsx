"use client";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch"
const fetcher = (url: string) => fetch(url).then((res) => res.json());
import { useToast } from "@/components/ui/use-toast"

export default function TableVolume() {
    const { data, error } = useSWR('/api/volume', fetcher);
    const { toast } = useToast()
    const { volumeOverAll,
        setVolumeOverAll, } = useAddress();

    const [show, setShow] = useState(false);
    const [showMore, setShowMore] = useState(3);
    const handleShow = () => setShow(!show);
    const handleShowMore = () => {
        setShowMore(showMore + 3);
    };
    const handleShowLess = () => {
        setShowMore(3);
    };

    return (
        <main className="flex flex-col items-center w-[90%] mx-auto m-4 max-w-lg">
            <div className='flex gap-4'>
                <Button
                    onClick={handleShow}>
                    Show Volume
                </Button>
                {data && data.length > showMore && (
                    <Button onClick={handleShowMore}>
                        Show More
                    </Button>
                )}
                {data && data.length > 3 && (
                    <Button onClick={handleShowLess}>
                        Show Less
                    </Button>
                )}
            </div>
            {
                show && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Volume</TableHead>
                                <TableHead>Total/1M</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data && data.slice(Math.max(data.length - showMore, 0)).map((item: any, index: number) => {
                                    const volumeUsd = parseFloat(item.total_volume).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    });
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{item.period}</TableCell>
                                            <TableCell className='text-primary'>${volumeUsd}</TableCell>
                                            {/* I want to have the item.total_volume / 1000000 */}
                                            <TableCell>{(1000000 * 1000000 / (parseFloat(item.total_volume))).toFixed(2)}</TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                )}
        </main>
    );
}
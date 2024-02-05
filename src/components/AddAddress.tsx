/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSWR from 'swr';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useAddress } from "@/context/MetaMaskProvider";
const formSchema = z.object({
    address: z.string().length(42, "Address must be 42 characters long"),
});
import { IoClose } from "react-icons/io5";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FormAddress() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: "",
        },
    })
    const {
        addresses,
        data,
        setData,
        setAddresses
    } = useAddress();

    //...
    useEffect(() => {
        const savedAddresses = localStorage.getItem('addresses');
        const parsedAddresses = savedAddresses ? JSON.parse(savedAddresses) : [];
        if (!Array.isArray(parsedAddresses)) {
            console.error("Parsed addresses is not an array");
            setAddresses([]);
        } else {
            setAddresses(parsedAddresses);
            fetchAll(parsedAddresses); // Appeler fetchAll avec les adresses récupérées
        }
    }, []);

    useEffect(() => {
        // Cet effet se déclenchera chaque fois que `addresses` change
        if (addresses.length > 0) {
            console.log("Addresses updated, now fetching:", addresses);
            fetchAll(addresses);
        }
    }, [addresses]); // Ajoutez `addresses` comme dépendance de l'effet

    // Modifiez fetchAll pour prendre les adresses en paramètre
    const fetchAll = async (addressesToFetch: string[]) => {
        console.log("Fetching data for addresses:", addressesToFetch);
        if (addressesToFetch.length > 0) {
            const url = `/api/balance/${addressesToFetch.join('')}`;
            try {
                const response = await fetcher(url);
                setData(response);
            } catch (error) {
                console.error("Failed to fetch balances:", error);
            }
        }
    };

    async function HandleSubmit(values: z.infer<typeof formSchema>) {
        let existingAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');
        if (!Array.isArray(existingAddresses)) {
            console.error("Existing addresses is not an array");
            existingAddresses = [];
        }
        const newAddresses = [...new Set([...existingAddresses, values.address])];
        localStorage.setItem('addresses', JSON.stringify(newAddresses));
        setAddresses(newAddresses); // Ceci déclenchera le useEffect qui appelle fetchAll
    };




    return (
        <div>

            {
                addresses.length > 0 &&
                <div className="flex flex-col items-center mb-4 gap-2">
                    {
                        addresses.map((address: string, index: number) => {
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 text-xs md-text-base"
                                >

                                    {address}
                                    <IoClose
                                        className="text-red-500 cursor-pointer"
                                        size={24}
                                        onClick={() => {
                                            const newAddresses = addresses.filter((a: string) => a !== address);
                                            setAddresses(newAddresses);
                                            localStorage.setItem('addresses', JSON.stringify(newAddresses));
                                        }}
                                    />
                                </div>

                            )
                        })
                    }
                </div>
            }
            <Form {...form}>
                <form onSubmit={form.handleSubmit(HandleSubmit)} className="flex w-full gap-4">
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input placeholder="Enter your wallet address" {...field} className="w-full border-primary outline-none focus:outline-none" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="rounded-md">Check</Button>
                </form>
            </Form>
        </div>
    );
}

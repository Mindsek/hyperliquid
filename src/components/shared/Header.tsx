/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from 'react'
import { FaDiscord } from "react-icons/fa";
import Link from 'next/link';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
const links = [
    { title: 'Rank', href: '/' },
    { title: 'Farm', href: '/farm' },
]
const Header = () => {
    const [isScrolling, setIsScrolling] = useState(false)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolling(true)
            } else {
                setIsScrolling(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <nav className={
            cn('flex px-8 py-4 w-full transition-all border-b border-primary',
                isScrolling ? 'fixed top-0 shadow-lg z-50 bg-background/40 hover:bg-background backdrop-blur-sm' : 'relative bg-background')
        }>
            <div className='w-full max-w-lg mx-auto flex items-center justify-between'>
                <Button className="pulse text-black font-bold">
                    <Link href="https://discord.gg/heNygeAqG7" target="_blank" rel="noreferrer" className='flex items-center gap-2'>
                        <FaDiscord size={24} />
                        <span>Le Penthouse</span>
                    </Link>
                </Button>
            </div>
        </nav >
    )
}

export default Header
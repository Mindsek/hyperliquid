import { NextResponse } from "next/server";
const HYPERLIQUID_API_URL = 'https://api.hyperliquid.xyz/info';

async function fetchStats() {

    const start_date = new Date('2023-06-14').toISOString().split('T')[0];
    const end_date = new Date().toISOString().split('T')[0];
    const apiResponse = await fetch(`https://stats-api.hyperliquid.xyz/hyperliquid/total_users?start_date=${start_date}&end_date=${end_date}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
    });

    const apiResponse2 = await fetch(`https://stats-api.hyperliquid.xyz/hyperliquid/total_deposits?start_date=${start_date}&end_date=${end_date}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
    });
    if (!apiResponse.ok || !apiResponse2.ok) {
        throw new Error(`API responded with status: ${apiResponse.status} ${apiResponse2.status}`);
    }

    const total_users = await apiResponse.json();
    const total_deposits = await apiResponse2.json();

    return { total_users, total_deposits };
}
export async function GET() {
    try {
        const stats = await fetchStats();
        return NextResponse.json(stats)

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

import { NextResponse } from "next/server";
const HYPERLIQUID_API_URL = 'https://api.hyperliquid.xyz/info';

// https://stats-api.hyperliquid.xyz/hyperliquid/total_users?start_date=2023-06-14&end_date=2024-02-06 so we need to fetch it from 2023-06-14 to now so we can get the total users {"total_users":52632}
// {"total_deposits":411431119.24924445} https://stats-api.hyperliquid.xyz/hyperliquid/total_deposits?start_date=2023-06-14&end_date=2024-02-06
async function fetchStats() {

    const date = new Date();
    const start_date = new Date('2023-06-14');
    const end_date = new Date(date.toISOString().split('T')[0]);
    console.log(start_date.toISOString().split('T')[0], end_date.toISOString().split('T')[0]);

    // const apiResponse = await fetch(HYPERLIQUID_API_URL, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     cache: 'no-cache',
    // });
    const apiResponse = await fetch(`https://stats-api.hyperliquid.xyz/hyperliquid/total_users?start_date=${start_date.toISOString().split('T')[0]}&end_date=${end_date.toISOString().split('T')[0]}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
    });

    const apiResponse2 = await fetch(`https://stats-api.hyperliquid.xyz/hyperliquid/total_deposits?start_date=${start_date.toISOString().split('T')[0]}&end_date=${end_date.toISOString().split('T')[0]}`, {
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

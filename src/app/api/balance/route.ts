import { NextResponse } from "next/server";
const HYPERLIQUID_API_URL = 'https://api.hyperliquid.xyz/info';
const addresses = [
    "0x09ee3e57a025e77de6c71802af1ec6837114f0fc",
    "0xbc8ea8b8516989a07bd61d5bfd50c8c4de12ec9f",
    "0xab2e7e0e0839a970881c862b8de1ed4da599975c",
    "0xf63a392a75dd1a9452b0865f615037b5bb0b81a4",
]
async function fetchUserData(address: string) {
    const body = {
        type: 'clearinghouseState',
        user: address,
    };
    const apiResponse = await fetch(HYPERLIQUID_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-cache',
    });

    if (!apiResponse.ok) {
        throw new Error(`API responded with status: ${apiResponse.status}`);
    }

    return apiResponse.json();
}
async function fetchPortfolio(address: string) {
    const body = {
        type: 'portfolio',
        user: address,
    };
    const apiResponse = await fetch(HYPERLIQUID_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-cache',
    });

    if (!apiResponse.ok) {
        throw new Error(`API responded with status: ${apiResponse.status}`);
    }
    const data = await apiResponse.json();
    return data[3][1].vlm;
}
export async function GET() {
    try {
        let balances = await Promise.all(
            addresses.map(async (address) => {
                const data = await fetchUserData(address);
                const anyPositions = data?.assetPositions?.map((position: any) => ({
                    asset: position.position.coin,
                    positionValue: position.position.positionValue,
                    marginUsed: position.position.marginUsed,
                    leverage: position.position.leverage.value,
                    entryPx: position.position.entryPx,
                    liquidationPx: position.position.liquidationPx,
                    unrealizedPnl: position.position.unrealizedPnl,
                }));
                const portfolio = await fetchPortfolio(address);
                return {
                    address,
                    totalRawUsd: data?.crossMarginSummary?.totalRawUsd,
                    positions: anyPositions || [],
                    portfolio,
                };
            })
        );

        return NextResponse.json(balances)

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

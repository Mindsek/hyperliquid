import { NextResponse } from "next/server";
const HYPERLIQUID_API_URL = 'https://api.hyperliquid.xyz/info';

interface ChartData {
    time: string;
    coin: string;
    total_volume: number;
}

interface WeeklyVolume {
    [key: string]: number; // Ceci ajoute une signature d'index à l'objet
}

interface VolumeResult {
    period: string;
    total_volume: number;
}

async function getWeeklyVolumes(startDate: string, endDate: string): Promise<VolumeResult[]> {
    const url = `https://stats-api.hyperliquid.xyz/hyperliquid/total_volume?start_date=${startDate}&end_date=${endDate}`
    console.log(url)
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
    });
    const data = await response.json();
    const chartData = data.chart_data;

    let weeklyVolumes: WeeklyVolume = {};
    let currentStartWeek = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
    let currentEndWeek = new Date(currentStartWeek);
    currentEndWeek.setDate(currentEndWeek.getDate() + 6);

    chartData.forEach((item: ChartData) => {
        let itemDate = new Date(item.time);
        let period = `${currentStartWeek.toISOString().split('T')[0]}/${currentEndWeek.toISOString().split('T')[0]}`;

        while (itemDate >= currentEndWeek) { // Trouver la bonne semaine pour l'élément de données
            currentStartWeek.setDate(currentStartWeek.getDate() + 7);
            currentEndWeek = new Date(currentStartWeek);
            currentEndWeek.setDate(currentEndWeek.getDate() + 6);
            period = `${currentStartWeek.toISOString().split('T')[0]}/${currentEndWeek.toISOString().split('T')[0]}`;
        }

        if (!weeklyVolumes[period]) {
            weeklyVolumes[period] = 0;
        }
        weeklyVolumes[period] += item.total_volume;
    });

    const result: VolumeResult[] = Object.keys(weeklyVolumes).map(week => {
        return { period: week, total_volume: weeklyVolumes[week] };
    });

    return result;
}

export async function GET() {
    try {
        const data = await getWeeklyVolumes('2023-11-02', '2024-02-06');
        return NextResponse.json(data)

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

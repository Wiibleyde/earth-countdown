import { getBiggestTimerLeaderboard } from "@/database";
import { initDatabaseOnStartup } from "@/lib/db-init";
import { NextResponse } from "next/server";

export async function GET() {
    await initDatabaseOnStartup();

    const leaderboard = await getBiggestTimerLeaderboard();
    if (!leaderboard) {
        return NextResponse.json({ error: 'Leaderboard not found' }, { status: 404 });
    }

    return NextResponse.json({ data: leaderboard }, { status: 200 });
}
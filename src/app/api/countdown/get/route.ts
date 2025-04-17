import { config } from '@/config';
import { getCountdownOrCreate, ICountdown } from '@/database';
import { initDatabaseOnStartup } from '@/lib/db-init';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
    // S'assurer que la base de données est initialisée
    await initDatabaseOnStartup();

    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { user } = session;
    const email = user?.email;
    if (!email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const finishingTime = new Date(Date.now() + config.defaultCountDown * 1000);
    const countdown = (await getCountdownOrCreate(email, finishingTime.toISOString())) as ICountdown;
    if (!countdown) {
        return NextResponse.json({ error: 'Countdown not found' }, { status: 404 });
    }
    return NextResponse.json({ data: countdown }, { status: 200 });
}

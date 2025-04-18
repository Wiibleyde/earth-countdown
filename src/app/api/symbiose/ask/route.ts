import { config } from '@/config';
import { getCountdown, updateCountdown } from '@/database';
import { generateEcoScoreWithGoogle } from '@/intelligence';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userSentance } = await req.json();
    if (!userSentance) {
        return NextResponse.json({ error: 'No user sentence provided' }, { status: 400 });
    }

    const response = await generateEcoScoreWithGoogle(userSentance);
    if (!response) {
        return NextResponse.json({ error: 'Failed to generate eco score' }, { status: 500 });
    }
    console.log('Response from AI:', response);
    const points = response.points;
    if (points < -10 || points > 10) {
        return NextResponse.json({ error: 'Invalid points value' }, { status: 500 });
    }

    const actualCountdown = await getCountdown(session.user?.email || '');
    if (!actualCountdown) {
        return NextResponse.json({ error: 'No countdown found' }, { status: 500 });
    }
    const finishingAt = new Date(actualCountdown.finishingAt);

    // Each point adds or subtracts points * config.pointInHours hours
    const hoursToAdd = points * config.pointInHours;
    const newFinishingAt = new Date(finishingAt.getTime() + hoursToAdd * 60 * 60 * 1000);
    const newCountdown = {
        userEmail: session.user?.email || '',
        finishingAt: newFinishingAt.toISOString(),
    };
    await updateCountdown(newCountdown.userEmail, newCountdown.finishingAt);

    return NextResponse.json({ data: response }, { status: 200 });
}

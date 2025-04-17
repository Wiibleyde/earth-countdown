import { generateEcoScoreWithGoogle } from "@/intelligence";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
    return NextResponse.json({ data: response }, { status: 200 });
}
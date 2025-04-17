'use client';
import { Countdown } from '@/components/countdown/Countdown';
import { Gemini } from '@/components/countdown/Symbiose';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-24 bg-gradient-to-b from-blue-50 to-blue-100">
            <h1 className="text-4xl font-bold">Countdown Timer</h1>
            <div className="flex flex-col items-center justify-center mt-10" id="countdown">
                <Countdown />
            </div>
            <div className="flex flex-col items-center justify-center mt-10 w-full" id="iaGenerator">
                <Gemini />
            </div>
        </main>
    );
}

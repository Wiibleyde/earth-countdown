'use client';

import { BiggestTimer } from "@/components/leadeboard/BiggestTimer";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-24 bg-gradient-to-b from-blue-50 to-blue-100">
            <h1 className="text-4xl font-bold">Classement</h1>
            <div className="flex flex-col items-center justify-center mt-10 w-full" id="biggestTimer">
                <div>
                    <BiggestTimer />
                </div>
            </div>
        </main>
    );
}

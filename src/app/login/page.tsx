'use client';

import { DiscordSign } from '@/components/LoginUtils/SignIn';

export default function Login() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
            <div className="mb-4 flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-accent">Connexion à Time4Earth</p>
                    <p className="text-gray-600 mt-2">Connectez-vous avec votre compte Discord pour continuer.</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <DiscordSign />
                </div>
            </div>
        </main>
    );
}

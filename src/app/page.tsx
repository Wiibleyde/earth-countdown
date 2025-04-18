'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    const session = useSession();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-b from-blue-50 to-blue-100">
            <header className="text-center">
                <h1 className="text-5xl font-extrabold text-accent">Earth Countdown</h1>
                <p className="mt-4 text-xl text-gray-700">Une échéance adaptable pour un avenir durable.</p>
                <div className="flex justify-center mt-6">
                    <Image
                        src={'/earth.png'}
                        alt="Earth"
                        width={200}
                        height={200}
                        className="animate-spin3d rounded-full mt-6"
                    />
                </div>
            </header>
            <section className="mt-8 text-lg text-center bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                {session.status === 'loading' ? (
                    <p className="text-gray-500">Chargement...</p>
                ) : session.status === 'authenticated' ? (
                    <div className="flex flex-col items-center">
                        <p className="text-gray-800">Bienvenue, {session.data?.user?.name}.</p>
                        <Link href="/countdown" className="mt-4 text-shadow-accent hover:underline">
                            Accéder à mon compteur
                        </Link>
                    </div>
                ) : (
                    <p className="text-gray-500">Veuillez vous <Link href={"/login"} className="text-accent hover:text-primary-light underline transition-colors duration-300">connecter</Link> pour continuer.</p>
                )}
            </section>
        </main>
    );
}

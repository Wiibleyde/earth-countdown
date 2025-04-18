'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { ICountdown } from '@/database';

interface CountdownResponse {
    data: ICountdown;
}

export function Countdown() {
    const fetcher = (url: string): Promise<CountdownResponse> => fetch(url).then((res) => res.json());

    const { data, isLoading, error } = useSWR<CountdownResponse, Error>('/api/countdown/get', fetcher, {
        refreshInterval: 1000,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    const [finishingTime, setFinishingTime] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const calculateTimeLeft = () => {
        if (!finishingTime) return;

        const difference = finishingTime.getTime() - Date.now();

        if (difference <= 0) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        });
    };

    useEffect(() => {
        if (data && data.data) {
            setFinishingTime(new Date(data.data.finishingAt));
        }
    }, [data]);

    useEffect(() => {
        if (!finishingTime) return;

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [finishingTime]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <div className="">
            <div className="flex gap-6 text-center">
                <div className="flex flex-col">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-24 h-24 flex items-center justify-center">
                        <span className="text-4xl font-bold text-shadow-accent">{timeLeft.days}</span>
                    </div>
                    <span className="mt-2 text-gray-700">Jours</span>
                </div>

                <div className="flex flex-col">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-24 h-24 flex items-center justify-center">
                        <span className="text-4xl font-bold text-shadow-accent">{timeLeft.hours}</span>
                    </div>
                    <span className="mt-2 text-gray-700">Heures</span>
                </div>

                <div className="flex flex-col">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-24 h-24 flex items-center justify-center">
                        <span className="text-4xl font-bold text-shadow-accent">{timeLeft.minutes}</span>
                    </div>
                    <span className="mt-2 text-gray-700">Minutes</span>
                </div>

                <div className="flex flex-col">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-24 h-24 flex items-center justify-center">
                        <span className="text-4xl font-bold text-shadow-accent">{timeLeft.seconds}</span>
                    </div>
                    <span className="mt-2 text-gray-700">Secondes</span>
                </div>
            </div>
            <div className="mt-4 text-center">
                <p className="text-base text-primary">
                    Démarré le{' '}
                    {data?.data.createdAt &&
                        new Date(data.data.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                </p>
            </div>
        </div>
    );
}

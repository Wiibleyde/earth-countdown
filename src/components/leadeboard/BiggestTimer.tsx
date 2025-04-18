'use client';

import { ICountdown } from '@/database';
import useSWR from 'swr';
import { useEffect, useState } from 'react';

interface BiggestLeaderboardResponse {
    data: ICountdown[];
}

interface TimerProps {
    finishingAt: string;
}

// Composant pour afficher le décompte dynamique et la jauge
function CountdownTimer({ finishingAt }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const targetDate = new Date(finishingAt).getTime();
    const now = new Date().getTime();

    // Calculer le temps total en secondes entre la création et la fin
    const totalDuration = targetDate - now;
    const isExpired = totalDuration <= 0;

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="flex flex-col w-full">
            {isExpired ? (
                <div className="text-red-500 font-semibold">Terminé</div>
            ) : (
                <div className="text-sm font-medium">
                    {timeLeft.days}j {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </div>
            )}
        </div>
    );
}

export function BiggestTimer() {
    const fetcher = (url: string): Promise<BiggestLeaderboardResponse> => fetch(url).then((res) => res.json());

    const { data, isLoading, error } = useSWR('/api/leaderboard/biggest', fetcher);

    if (isLoading) return <div>Chargement...</div>;
    if (error) return <div>Erreur lors du chargement du classement</div>;
    if (!data || !data.data) return <div>Aucune donnée disponible</div>;

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Place</th>
                        <th className="py-2 px-4 border-b">Utilisateur</th>
                        <th className="py-2 px-4 border-b">État du timer</th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">{index + 1}</td>
                            <td className="py-2 px-4 border-b">{user.userEmail}</td>
                            <td className="py-2 px-4 border-b">
                                <CountdownTimer finishingAt={user.finishingAt} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

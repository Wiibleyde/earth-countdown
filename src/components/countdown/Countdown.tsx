'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { ICountdown } from '@/database';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownResponse {
    data: ICountdown;
}

export function Countdown() {
    const fetcher = (url: string): Promise<CountdownResponse> => fetch(url).then((res) => res.json());

    const { data, isLoading, error, mutate } = useSWR<CountdownResponse, Error>('/api/countdown/get', fetcher, {
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
    const [isExpired, setIsExpired] = useState(false);
    const [isRestarting, setIsRestarting] = useState(false);

    const calculateTimeLeft = () => {
        if (!finishingTime) return;

        const difference = finishingTime.getTime() - Date.now();

        if (difference <= 0) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            setIsExpired(true);
            return;
        }

        setIsExpired(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finishingTime]);

    const handleRestart = async () => {
        setIsRestarting(true);
        try {
            const response = await fetch('/api/countdown/restart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                mutate();
                setIsExpired(false);
            }
        } catch (error) {
            console.error('Error restarting countdown:', error);
        } finally {
            setIsRestarting(false);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-40">
            <motion.div 
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
    
    if (error) return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center p-4"
        >
            Error: {error.message}
        </motion.div>
    );
    
    return (
        <div className="py-4">
            {isExpired ? (
                <motion.div 
                    className="flex flex-col items-center justify-center gap-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <h2 className="text-2xl font-bold text-red-600">Temps écoulé !</h2>
                    <p className="text-center text-gray-700">
                        Votre compte à rebours a atteint zéro.
                        <br />
                        {data?.data?.lossCount ? (data.data.lossCount > 0 && (
                            <span className="block mt-2">
                                Vous avez perdu {data.data.lossCount} fois.
                            </span>
                        )) : null}
                    </p>
                    <motion.button
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isRestarting}
                        onClick={handleRestart}
                    >
                        {isRestarting ? 'Redémarrage en cours...' : 'Recommencer'}
                    </motion.button>
                </motion.div>
            ) : (
                <>
                    <div className="flex gap-6 text-center flex-wrap justify-center">
                        <CountdownItem value={timeLeft.days} label="Jours" />
                        <CountdownItem value={timeLeft.hours} label="Heures" />
                        <CountdownItem value={timeLeft.minutes} label="Minutes" />
                        <CountdownItem value={timeLeft.seconds} label="Secondes" />
                    </div>
                    <motion.div 
                        className="mt-4 text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
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
                        {data?.data?.lossCount ? (data.data.lossCount > 0 && (
                            <p className="text-sm text-gray-600 mt-2">
                                Nombre de défaites: {data.data.lossCount}
                            </p>
                        )) : null}
                    </motion.div>
                </>
            )}
        </div>
    );
}

function CountdownItem({ value, label }: { value: number, label: string }) {
    return (
        <div className="flex flex-col">
            <motion.div 
                className="bg-white rounded-lg shadow-lg p-6 w-24 h-24 flex items-center justify-center relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ 
                    type: "spring", 
                    stiffness: 300,
                    boxShadow: {
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut"
                    }
                }}
                animate={{ 
                    boxShadow: ["0px 4px 10px rgba(0,0,0,0.1)", "0px 6px 15px rgba(0,0,0,0.15)", "0px 4px 10px rgba(0,0,0,0.1)"]
                }}
            >
                <AnimatePresence mode="popLayout">
                    <motion.span 
                        key={value} 
                        className="text-4xl font-bold text-shadow-accent absolute"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 80 }}
                    >
                        {value}
                    </motion.span>
                </AnimatePresence>
            </motion.div>
            <motion.span 
                className="mt-2 text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {label}
            </motion.span>
        </div>
    );
}

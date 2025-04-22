"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Slogans() {
    const slogans = [
        "🚿 Chaque goutte compte",
        "🛒 Consommer mieux, c'est déjà agir",
        "🚲 Bouge vert !",
        "🌱 Petits gestes, grande planète",
        "💡 Éteins, c'est gagné !",
        "📵 Moins de clics, plus d'impact",
        "🌸 Protège ceux qui n'ont pas de voix",
        "🧽 Nettoyer, oui. Polluer, non !"
    ]
    const [currentSlogan, setCurrentSlogan] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlogan((prev) => (prev + 1) % slogans.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slogans.length]);

    return (
        <div className="flex justify-center items-center my-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlogan}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-green-100 border-2 border-green-500 rounded-lg p-4 shadow-md max-w-md"
                >
                    <p className="text-center text-lg font-medium text-green-800">
                        {slogans[currentSlogan]}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
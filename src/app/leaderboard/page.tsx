import { BiggestTimer } from '@/components/leadeboard/BiggestTimer';
import { MostRestart } from '@/components/leadeboard/MostRestart';

export default function Leaderboard() {
    return (
        <main className="flex min-h-screen flex-col items-center p-24 bg-gradient-to-b from-blue-50 to-blue-100">
            <h1 className="text-4xl font-bold">Classements</h1>
            <div className="flex flex-row items-center justify-between mt-10 w-full" id="biggestTimer">
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold mb-4">Le plus grand compteur</h2>
                    <BiggestTimer />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold mb-4">Le plus de redémarrages</h2>
                    <MostRestart />
                </div>
            </div>
        </main>
    );
}

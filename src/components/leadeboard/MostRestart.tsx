'use client';
import { ICountdown } from '@/database';
import useSWR from 'swr';

interface BiggestLeaderboardResponse {
    data: ICountdown[];
}

export function MostRestart() {
    const fetcher = (url: string): Promise<BiggestLeaderboardResponse> => fetch(url).then((res) => res.json());

    const { data, isLoading, error } = useSWR('/api/leaderboard/worst', fetcher);

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
                        <th className="py-2 px-4 border-b">Nombre de fois</th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">{index + 1}</td>
                            <td className="py-2 px-4 border-b">{user.userEmail}</td>
                            <td className="py-2 px-4 border-b">{user.lossCount} fois</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

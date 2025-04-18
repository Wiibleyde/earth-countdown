import { config } from '@/config';
import { incrementLossCount, restartCountdown } from '@/database';
import { initDatabaseOnStartup } from '@/lib/db-init';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// Cette fonction est appelée lorsque le compte à rebours atteint zéro
// Elle incrémente le compteur de défaites et redémarre le compte à rebours
export async function POST() {
    // Initialiser la base de données
    await initDatabaseOnStartup();

    // Vérifier l'authentification
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { user } = session;
    const email = user?.email;
    if (!email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Incrémenter le compteur de défaites pour cet utilisateur
        await incrementLossCount(email);
        
        // Calculer la nouvelle date de fin en utilisant le compte à rebours par défaut
        const newFinishingTime = new Date(Date.now() + config.defaultCountDown * 1000);
        
        // Mettre à jour le compte à rebours
        await restartCountdown(email, newFinishingTime.toISOString());
        
        // Retourner la réponse avec succès
        return NextResponse.json(
            { 
                message: 'Compte à rebours redémarré et défaite enregistrée',
                newFinishingTime: newFinishingTime.toISOString()
            }, 
            { status: 200 }
        );
    } catch (error) {
        console.error('Error restarting countdown:', error);
        return NextResponse.json(
            { error: 'Failed to restart countdown' }, 
            { status: 500 }
        );
    }
}
import { initDatabase } from '../database';

let isInitialized = false;

export async function initDatabaseOnStartup() {
    if (isInitialized) {
        return;
    }

    try {
        // S'assurer que ce code ne s'exécute que côté serveur
        if (typeof window !== 'undefined') {
            return;
        }

        console.log('Initializing database on server startup...');
        await initDatabase();
        console.log('Database initialized successfully');
        isInitialized = true;
    } catch (error) {
        console.error('Failed to initialize database on startup:', error);
        // Ne pas définir isInitialized à true en cas d'erreur
        // pour réessayer à la prochaine demande
    }
}

// Fonction pour vérifier l'état de la base de données
export function isDatabaseInitialized() {
    return isInitialized;
}

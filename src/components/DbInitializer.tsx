// Ce composant s'occupe d'initialiser la base de données côté serveur
// et n'a pas d'effet sur le client
'use server';

import { initDatabase } from '@/database';

// Cette fonction n'a pas de rendu visible - elle initialise simplement la DB
export async function DbInitializer() {
    try {
        console.log('Initializing database from server component...');
        await initDatabase();
        console.log('Database initialized successfully from server component');
    } catch (error) {
        console.error('Failed to initialize database from server component:', error);
    }

    // Ce composant ne rend rien
    return null;
}

import { NextResponse } from 'next/server';
import { initDatabase } from '@/database';

// Cette route API s'exécute côté serveur et permet d'initialiser la base de données
// Elle ne sera pas accessible publiquement car elle est dans un dossier privé (_db)
export async function GET() {
    try {
        console.log('Initializing database via server API...');
        await initDatabase();
        console.log('Database initialized successfully via API');
        return NextResponse.json({ success: true, message: 'Database initialized successfully' });
    } catch (error) {
        console.error('Failed to initialize database:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to initialize database', error: String(error) },
            { status: 500 }
        );
    }
}

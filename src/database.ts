import * as sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// S'assurer que ce code ne s'exécute que côté serveur
let db: sqlite3.Database | null = null;

// Fonction pour obtenir un chemin absolu vers la base de données
function getDatabasePath() {
    // Vérifier que nous sommes bien dans un environnement serveur
    if (typeof window !== 'undefined') {
        throw new Error('Database operations should only be executed on the server side');
    }

    // Créer le dossier data s'il n'existe pas
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    return path.join(dataDir, 'database.db');
}

// Fonction d'initialisation de la base de données
export function initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(); // La base de données est déjà initialisée
            return;
        }

        const dbPath = getDatabasePath();
        console.log(`Initializing database at ${dbPath}`);

        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database: ' + err.message);
                reject(err);
            } else {
                console.log('Connected to the SQLite database.');
                createTable()
                    .then(() => resolve())
                    .catch(reject);
            }
        });
    });
}

export interface ICountdown {
    id: number;
    finishingAt: string;
    userEmail: string;
    createdAt: string;
}

export function createTable(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized. Call initDatabase() first.'));
            return;
        }

        db.run(
            `CREATE TABLE IF NOT EXISTS countdown (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            finishingAt TEXT NOT NULL,
            userEmail TEXT NOT NULL UNIQUE,
            createdAt TEXT NOT NULL
        )`,
            (err) => {
                if (err) {
                    console.error('Error creating table: ' + err.message);
                    reject(err);
                } else {
                    console.log('Table created or already exists.');
                    resolve();
                }
            }
        );
    });
}

// S'assurer que la base de données est initialisée avant d'exécuter des requêtes
async function ensureDatabaseInitialized() {
    if (!db) {
        await initDatabase();
    }
    return db!;
}

export async function getCountdown(userEmail: string): Promise<ICountdown | null> {
    const database = await ensureDatabaseInitialized();

    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM countdown WHERE userEmail = ?`, [userEmail], (err, rows: ICountdown[]) => {
            if (err) {
                console.error('Error fetching countdowns: ' + err.message);
                reject(err);
            } else {
                resolve(rows.length > 0 ? rows[0] : null);
            }
        });
    });
}

export async function addCountdown(userEmail: string, finishingAt: string): Promise<void> {
    const database = await ensureDatabaseInitialized();
    const createdAt = new Date().toISOString(); // Current timestamp in ISO format

    return new Promise((resolve, reject) => {
        database.run(
            `INSERT INTO countdown (userEmail, finishingAt, createdAt) VALUES (?, ?, ?)`,
            [userEmail, finishingAt, createdAt],
            function (err) {
                if (err) {
                    console.error('Error adding countdown: ' + err.message);
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

export async function getCountdownOrCreate(userEmail: string, finishingAt: string): Promise<ICountdown> {
    try {
        const countdown = await getCountdown(userEmail);
        if (countdown) {
            return countdown;
        } else {
            await addCountdown(userEmail, finishingAt);
            const newCountdown = await getCountdown(userEmail);
            if (newCountdown) {
                return newCountdown;
            } else {
                throw new Error('Failed to create and retrieve countdown.');
            }
        }
    } catch (err) {
        throw err;
    }
}

// Fonction pour fermer proprement la base de données (utile pour les tests ou le redémarrage)
export function closeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!db) {
            resolve();
            return;
        }

        db.close((err) => {
            if (err) {
                console.error('Error closing database: ' + err.message);
                reject(err);
            } else {
                console.log('Database connection closed.');
                db = null;
                resolve();
            }
        });
    });
}

export async function updateCountdown(userEmail: string, finishingAt: string): Promise<void> {
    const database = await ensureDatabaseInitialized();

    return new Promise((resolve, reject) => {
        database.run(
            `UPDATE countdown SET finishingAt = ? WHERE userEmail = ?`,
            [finishingAt, userEmail],
            function (err) {
                if (err) {
                    console.error('Error updating countdown: ' + err.message);
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}
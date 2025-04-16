import * as sqlite3 from 'sqlite3';

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error opening database: ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTable();
    }
});

export interface ICountdown {
    id: number;
    finishingAt: string;
    userEmail: string;
}

export function createTable() {
    db.run(`CREATE TABLE IF NOT EXISTS countdown (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        finishingAt TEXT NOT NULL,
        userEmail TEXT NOT NULL UNIQUE
    )`, (err) => {
        if (err) {
            console.error('Error creating table: ' + err.message);
        } else {
            console.log('Table created or already exists.');
        }
    });
}

export function getCountdown(userEmail: string): Promise<ICountdown | null> {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM countdown WHERE userEmail = ?`, [userEmail], (err, rows: ICountdown[]) => {
            if (err) {
                console.error('Error fetching countdowns: ' + err.message);
                reject(err);
            } else {
                resolve(rows.length > 0 ? rows[0] : null);
            }
        });
    });
}

export function addCountdown(userEmail: string, finishingAt: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO countdown (userEmail, finishingAt) VALUES (?, ?)`, [userEmail, finishingAt], function (err) {
            if (err) {
                console.error('Error adding countdown: ' + err.message);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function getCountdownOrCreate(userEmail: string, finishingAt: string): Promise<ICountdown> {
    return new Promise(async (resolve, reject) => {
        try {
            const countdown = await getCountdown(userEmail);
            if (countdown) {
                resolve(countdown);
            } else {
                await addCountdown(userEmail, finishingAt);
                const newCountdown = await getCountdown(userEmail);
                if (newCountdown) {
                    resolve(newCountdown);
                } else {
                    reject(new Error('Failed to create and retrieve countdown.'));
                }
            }
        } catch (err) {
            reject(err);
        }
    });
}

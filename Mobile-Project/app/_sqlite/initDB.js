import { db } from './db';

// Käytetään tietokanta komentoja luomaan taulukko:
export async function initDB() {
  const database = await db;
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY NOT NULL,
      avatar INTEGER
    );
  `);

  const existing = await database.getFirstAsync(
    'SELECT * FROM profile WHERE id = 1'
  );

  if (!existing) {
    await database.runAsync(
      'INSERT INTO profile (id, avatar) VALUES (1, 0)'
    );
  }
}
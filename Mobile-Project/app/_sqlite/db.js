import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseAsync('app.db');
import { db } from './db';

export async function getAvatar() {
  const database = await db;
  const row = await database.getFirstAsync(
    'SELECT avatar FROM profile WHERE id = 1'
  );
  return row?.avatar ?? 0;
}

export async function setAvatar(avatarId) {
  const database = await db;
  await database.runAsync(
    'UPDATE profile SET avatar = ? WHERE id = 1',
    [avatarId]
  );
}
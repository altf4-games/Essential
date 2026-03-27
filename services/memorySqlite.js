import * as SQLite from 'expo-sqlite';

const DB_NAME = 'essential.db';

const parseTagsJson = (value) => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const mapRowToMemory = (row) => ({
  id: row.id,
  imageUri: row.image_uri,
  summary: row.summary,
  tags: parseTagsJson(row.tags_json),
  reminderAt: row.reminder_at,
  reminderNote: row.reminder_note,
  createdAt: row.created_at,
  location: row.location,
});

export async function initMemoryTable() {
  const db = await SQLite.openDatabaseAsync(DB_NAME);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY NOT NULL,
      image_uri TEXT,
      summary TEXT,
      tags_json TEXT,
      reminder_at TEXT,
      reminder_note TEXT,
      created_at TEXT NOT NULL,
      location TEXT
    );
  `);

  try {
    const tableInfo = await db.getAllAsync(`PRAGMA table_info(memories);`);
    const hasLocation = tableInfo.some(col => col.name === 'location');
    if (!hasLocation) {
      await db.runAsync(`ALTER TABLE memories ADD COLUMN location TEXT;`);
    }
  } catch (e) {
    console.warn("Migration error", e);
  }

  return db;
}

export async function insertMemory(memory) {
  const db = await initMemoryTable();
  await db.runAsync(
    `INSERT OR REPLACE INTO memories
      (id, image_uri, summary, tags_json, reminder_at, reminder_note, created_at, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    memory.id,
    memory.imageUri || null,
    memory.summary || '',
    JSON.stringify(memory.tags || []),
    memory.reminderAt || null,
    memory.reminderNote || '',
    memory.createdAt,
    memory.location || null,
  );
}

export async function getAllMemories() {
  const db = await initMemoryTable();
  const rows = await db.getAllAsync(
    'SELECT id, image_uri, summary, tags_json, reminder_at, reminder_note, created_at, location FROM memories ORDER BY created_at DESC',
  );

  return rows.map(mapRowToMemory);
}

export async function clearMemoriesTable() {
  const db = await initMemoryTable();
  await db.runAsync('DELETE FROM memories');
}

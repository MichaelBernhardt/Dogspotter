import SQLite from 'react-native-sqlite-storage';
import { Breed, Sighting } from '../types';
import breedsSeed from '../assets/breeds.json';

SQLite.enablePromise(true);

const DATABASE_NAME = 'dogspotter.db';

let db: SQLite.SQLiteDatabase | null = null;

export const getDB = async (): Promise<SQLite.SQLiteDatabase> => {
    if (db) {
        return db;
    }
    db = await SQLite.openDatabase({ name: DATABASE_NAME, location: 'default' });
    return db;
};

export const initDatabase = async () => {
    const database = await getDB();

    await database.executeSql(`
    CREATE TABLE IF NOT EXISTS breeds (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      alt_names TEXT,
      origin TEXT,
      size TEXT,
      coat_length TEXT,
      coat_type TEXT,
      colors TEXT,
      ears TEXT,
      tail TEXT,
      temperament TEXT,
      description TEXT
    );
  `);

    await database.executeSql(`
    CREATE TABLE IF NOT EXISTS sightings (
      id TEXT PRIMARY KEY,
      breed_id TEXT,
      dog_name TEXT,
      photo_uris TEXT,
      timestamp INTEGER,
      latitude REAL,
      longitude REAL,
      notes TEXT,
      FOREIGN KEY(breed_id) REFERENCES breeds(id)
    );
  `);

    // Always sync breeds to ensure consistency with the JSON file
    console.log('Syncing breeds...');
    const insertQuery = `
      INSERT OR REPLACE INTO breeds (id, name, alt_names, origin, size, coat_length, coat_type, colors, ears, tail, temperament, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await database.transaction(async (tx) => {
        // 1. Upsert all breeds from seed
        const promises = breedsSeed.map(breed =>
            tx.executeSql(insertQuery, [
                breed.id,
                breed.name,
                JSON.stringify(breed.alt_names),
                breed.origin,
                breed.size,
                breed.coat_length,
                breed.coat_type,
                JSON.stringify(breed.colors),
                breed.ears,
                breed.tail,
                JSON.stringify(breed.temperament),
                breed.description,
            ])
        );
        await Promise.all(promises);
    });

    // 2. Remove breeds that are no longer in the seed file (e.g. old slug-based IDs)
    const seedIds = breedsSeed.map(b => b.id);
    // SQLite limit for host parameters is usually 999, 170 is fine.
    // Constructing the query string manually to be safe with the array
    const placeholders = seedIds.map(() => '?').join(',');
    await database.executeSql(`DELETE FROM breeds WHERE id NOT IN (${placeholders})`, seedIds);

    console.log('Breed sync complete.');
};

export const getBreeds = async (): Promise<Breed[]> => {
    const database = await getDB();
    const [results] = await database.executeSql('SELECT * FROM breeds ORDER BY name ASC');
    const breeds: Breed[] = [];
    for (let i = 0; i < results.rows.length; i++) {
        const item = results.rows.item(i);
        breeds.push({
            ...item,
            alt_names: JSON.parse(item.alt_names),
            colors: JSON.parse(item.colors),
            temperament: JSON.parse(item.temperament),
        });
    }
    return breeds;
};

export const getBreedById = async (id: string): Promise<Breed | null> => {
    const database = await getDB();
    const [results] = await database.executeSql('SELECT * FROM breeds WHERE id = ?', [id]);
    if (results.rows.length > 0) {
        const item = results.rows.item(0);
        return {
            ...item,
            alt_names: JSON.parse(item.alt_names),
            colors: JSON.parse(item.colors),
            temperament: JSON.parse(item.temperament),
        };
    }
    return null;
};

export const addSighting = async (sighting: Sighting) => {
    const database = await getDB();
    await database.executeSql(
        `INSERT INTO sightings (id, breed_id, dog_name, photo_uris, timestamp, latitude, longitude, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            sighting.id,
            sighting.breed_id,
            sighting.dog_name,
            JSON.stringify(sighting.photo_uris),
            sighting.timestamp,
            sighting.latitude,
            sighting.longitude,
            sighting.notes,
        ]
    );
};

export const getSightings = async (): Promise<Sighting[]> => {
    const database = await getDB();
    const [results] = await database.executeSql('SELECT * FROM sightings ORDER BY timestamp DESC');
    const sightings: Sighting[] = [];
    for (let i = 0; i < results.rows.length; i++) {
        const item = results.rows.item(i);
        sightings.push({
            ...item,
            photo_uris: JSON.parse(item.photo_uris),
        });
    }
    return sightings;
};

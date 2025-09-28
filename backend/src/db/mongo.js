// backend/src/db/mongo.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart_library";

// Derive the db name from the URI path; default fallback.
const dbNameFromUri = (() => {
  try {
    const m = uri.match(/\/([^/?]+)(\?|$)/);
    return m?.[1] || "smart_library";
  } catch {
    return "smart_library";
  }
})();

let client;
let db;

export async function initMongo() {
  if (db) return db;
  client = new MongoClient(uri, {
    // Safe defaults; you can add serverApi if using Atlas
    maxPoolSize: 10,
  });
  await client.connect();
  db = client.db(dbNameFromUri);
  await ensureIndexes();
  console.log(`[mongo] connected to ${db.databaseName}`);
  return db;
}

export function getDb() {
  if (!db) throw new Error("Mongo not initialized. Call initMongo() first.");
  return db;
}

export function readingSessions() {
  return getDb().collection("reading_sessions");
}

async function ensureIndexes() {
  const col = readingSessions();
  await col.createIndex({ user_id: 1, start_time: -1 });
  await col.createIndex({ book_id: 1, start_time: -1 });
  await col.createIndex({ start_time: -1 });
}

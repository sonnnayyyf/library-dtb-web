#!/usr/bin/env node
// Normalize analytics data: make user_id/book_id numbers and add indexes.
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ Missing MONGO_URI (or MONGODB_URI) in .env');
  process.exit(1);
}

// Safe log (redact credentials)
const safeUri = uri.replace(/\/\/.*?:.*?@/, '//<user>:<pass>@');
console.log('Mongo Fix using URI:', safeUri);

const client = new MongoClient(uri, {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
});
await client.connect();

function dbNameFromUri(u) {
  try {
    const name = new URL(u).pathname.replace(/^\//, '');
    return name || 'smart_library';
  } catch {
    return 'smart_library';
  }
}

(async () => {
  await client.connect();
  const db = client.db(dbNameFromUri(uri));
  const col = db.collection('reading_sessions');
  console.log(`[mongo] connected → ${db.databaseName}.${col.collectionName}`);

  // Convert user_id & book_id from strings → ints
  const r1 = await col.updateMany(
    { user_id: { $type: 'string' } },
    [
      {
        $set: {
          user_id: {
            $convert: {
              input: '$user_id',
              to: 'int',
              onError: '$user_id',
              onNull: '$user_id'
            }
          }
        }
      }
    ]
  );

  const r2 = await col.updateMany(
    { book_id: { $type: 'string' } },
    [
      {
        $set: {
          book_id: {
            $convert: {
              input: '$book_id',
              to: 'int',
              onError: '$book_id',
              onNull: '$book_id'
            }
          }
        }
      }
    ]
  );

  // Indexes that help our analytics queries
  await col.createIndex({ user_id: 1, start_time: -1 });
  await col.createIndex({ book_id: 1, start_time: -1 });

  console.log(`✔ normalized docs — user_id modified: ${r1.modifiedCount}, book_id modified: ${r2.modifiedCount}`);
  await client.close();
  console.log('✔ done');
})().catch((e) => {
  console.error('❌ failed:', e.message);
  process.exit(1);
});

import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { closeDatabasePool, getDatabasePool } from './connection.js';

const schemaPath = fileURLToPath(new URL('./schema.sql', import.meta.url));
const downStatements = [
  'DROP TABLE IF EXISTS workflows',
  'DROP TABLE IF EXISTS goals',
  'DROP TABLE IF EXISTS metrics',
  'DROP TABLE IF EXISTS videos',
  'DROP TABLE IF EXISTS channels',
  'DROP TABLE IF EXISTS users',
];

async function migrate(): Promise<void> {
  const pool = getDatabasePool();
  if (process.argv.includes('--down')) {
    for (const statement of downStatements) await pool.query(statement);
    console.info('Database schema rolled back.');
  } else {
    await pool.query(await readFile(schemaPath, 'utf8'));
    console.info('Database schema migrated.');
  }
  await closeDatabasePool();
}

migrate().catch(async (error: unknown) => {
  await closeDatabasePool();
  console.error('Database migration failed:', error);
  process.exitCode = 1;
});

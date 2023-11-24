import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { certificates } from '../../schemas/schema.js';
import { logger } from '../../logger/logger.js';

const connectionString = process.env.DATABASE_URL

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
export const supabaseDB = drizzle(client);

export async function testingDB() {
  const allCertificates = await supabaseDB.select().from(certificates);

  logger.info({ allCertificates })
}

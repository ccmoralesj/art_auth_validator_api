import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export let supabaseDB: PostgresJsDatabase = undefined;
export function generateConnection() {
  const connectionString = process.env.DATABASE_URL;
  console.log(`connection String: ${connectionString}`);
  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(connectionString, { prepare: false });
  supabaseDB = drizzle(client);
}

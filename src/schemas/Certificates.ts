import { date, json, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { supabaseDB } from "../services/supabase/connection.js";
import { logger } from "../logger/logger.js";
import { eq } from "drizzle-orm";

export const certificates = pgTable('CERTIFICATES', {
  id: uuid('id').primaryKey(),
  createdAt: date('created_at'),
  artInfo: json('art_info'),
  hash: text('hash'),
  secret: text('secret'),
});


export async function testingDB() {
  const allCertificates = await supabaseDB.select().from(certificates);

  logger.info({ allCertificates })
}

export async function findCertificateBySecret(secret: string) {
  const [certificate] = await supabaseDB.select().from(certificates).where(eq(certificates.secret, secret))
  return certificate
}

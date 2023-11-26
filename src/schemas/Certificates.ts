import { date, json, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { supabaseDB } from "../services/supabase/connection.js";
import { logger } from "../logger/logger.js";
import { eq } from "drizzle-orm";
import { AuthenticityCertificate } from "../types/index.js";

export const certificates = pgTable('CERTIFICATES', {
  createdAt: date('created_at'),
  artInfo: json('art_info').notNull().$type<AuthenticityCertificate>(),
  hash: text('hash').notNull().unique(),
  secret: text('secret').notNull().unique(),
});

type NewCertificate = typeof certificates.$inferInsert

export async function testingDB() {
  const allCertificates = await supabaseDB.select().from(certificates);

  logger.info({ allCertificates })
}

export async function createCertificate(newCert: NewCertificate){
  return supabaseDB.insert(certificates).values(newCert).returning()
}

export async function findCertificateBySecret(secret: string) {
  const [certificate] = await supabaseDB.select().from(certificates).where(eq(certificates.secret, secret))
  return certificate
}

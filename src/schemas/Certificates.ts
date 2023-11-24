import { date, json, pgTable, serial, text, uuid, varchar } from "drizzle-orm/pg-core";

export const certificates = pgTable('CERTIFICATES', {
  id: uuid('id').primaryKey(),
  createdAt: date('created_at'),
  artInfo: json('art_info'),
  hash: text('hash'),
  secret: text('secret'),
});

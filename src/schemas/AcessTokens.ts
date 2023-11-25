import { date, pgTable, text, json } from "drizzle-orm/pg-core";
import { supabaseDB } from "../services/supabase/connection.js";
import { eq } from "drizzle-orm";
import { EndpointObject } from "../types/index.js";


export const accessTokens = pgTable('ACCESS_TOKENS', {
  createdAt: date('created_at'),
  name: text('name').notNull().unique(),
  key: text('key').notNull().unique(),
  endpoints: text('endpoints').array(),
});

type NewAccessToken = typeof accessTokens.$inferInsert


export async function createAccessToken(newAccessToken: NewAccessToken){
  return supabaseDB.insert(accessTokens).values(newAccessToken).returning()
}

export async function findAccessTokenByName(name: string) {
  const [accessToken] = await supabaseDB.select().from(accessTokens).where(eq(accessTokens.name, name))
  return accessToken
}

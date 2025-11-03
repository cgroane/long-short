import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const tenantsTable = pgTable("tenants", {
  id: uuid().default(sql`public.uuid_generate_v7()`).primaryKey().notNull(),
  name: text(),
  created: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
  updated: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
  deleted: timestamp({ mode: 'string' }),
});

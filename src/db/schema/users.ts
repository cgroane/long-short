import { pgTable, uuid, text, timestamp, varchar, vector, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const users = pgTable("users", {
  id: uuid().defaultRandom(),
  tenantId: uuid("tenant_id"),
  title: varchar({ length: 256 }),
});
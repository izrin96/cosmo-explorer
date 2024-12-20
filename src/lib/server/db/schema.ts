import { pgTable, varchar } from "drizzle-orm/pg-core";

export const accessToken = pgTable("access_token", {
  accessToken: varchar("access_token").notNull(),
  refreshToken: varchar("refresh_token").notNull(),
});

export type AccessToken = typeof accessToken.$inferSelect;

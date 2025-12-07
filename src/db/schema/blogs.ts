import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const blogs = pgTable("blogs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  authorId: text("author_id").notNull().references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

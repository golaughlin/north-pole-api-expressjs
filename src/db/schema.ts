import { pgTable, serial, varchar, date, boolean, timestamp } from "drizzle-orm/pg-core";

export const childrenTable = pgTable("children", {
	id: serial().primaryKey().notNull(),
	firstName: varchar("first_name", { length: 100 }).notNull(),
	lastName: varchar("last_name", { length: 100 }).notNull(),
	dateOfBirth: date("date_of_birth").notNull(),
	hometown: varchar({ length: 150 }),
	isNice: boolean("is_nice").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

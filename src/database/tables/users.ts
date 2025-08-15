import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";
import { UserPMRecipients } from "./user-pm-recipients";

export const Users = pgTable("users", {
  userId: varchar("userId", { length: 255 }).primaryKey().notNull(),
  firstname: varchar("firstname", { length: 255 }).notNull(),
  lastname: varchar("lastname", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 255 }).notNull(),
  addressLine1: varchar("addressLine1", { length: 255 }).notNull(),
  addressLine2: varchar("addressLine2", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  region: varchar("region", { length: 255 }).notNull(),
  postalCode: varchar("postalCode", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
});

export const UsersRelations = relations(Users, ({ many }) => ({
  userPocketMoneyRecipients: many(UserPMRecipients),
}));

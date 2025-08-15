import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { ResourceStatus } from "../enums";
import { relations } from "drizzle-orm";
import { UserPMRecipients } from "./user-pm-recipients";
import { PocketMoneys } from "./pocket-moneys";

// Users => UserPMRecipients => Recipients => PocketMoneys

export const Recipients = pgTable("recipients", {
  recipientId: uuid("recipientId").primaryKey().defaultRandom(),
  firstname: varchar("name", { length: 255 }).notNull(),
  lastname: varchar("lastname", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  status: ResourceStatus("status").default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
  updatedBy: varchar("updatedBy", { length: 255 }),
});

export const RecipientsRelations = relations(Recipients, ({ one, many }) => ({
  user: one(UserPMRecipients, {
    fields: [Recipients.recipientId],
    references: [UserPMRecipients.recipientId],
  }),
  pocketMoneys: many(PocketMoneys),
}));

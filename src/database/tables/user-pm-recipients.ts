import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { ResourceStatus } from "../enums";
import { Recipients } from "./recipients";
import { relations } from "drizzle-orm";
import { Users } from "./users";

// Users => UserPMRecipients => Recipients => PocketMoneys

export const UserPMRecipients = pgTable("user_pm_recipients", {
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => Users.userId),
  recipientId: uuid("recipientId")
    .notNull()
    .references(() => Recipients.recipientId),
  status: ResourceStatus("status").default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
  updatedBy: varchar("updatedBy", { length: 255 }),
});

export const UserPMRecipientsRelations = relations(
  UserPMRecipients,
  ({ one }) => ({
    recipient: one(Recipients, {
      fields: [UserPMRecipients.recipientId],
      references: [Recipients.recipientId],
    }),
    user: one(Users, {
      fields: [UserPMRecipients.userId],
      references: [Users.userId],
    }),
  })
);

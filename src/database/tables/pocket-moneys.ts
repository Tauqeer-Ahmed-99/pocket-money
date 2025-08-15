import {
  decimal,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { ResourceStatus } from "../enums";
import { Recipients } from "./recipients";
import { relations } from "drizzle-orm";
import { Transactions } from "./transactions";

// Users => UserPMRecipients => Recipients => PocketMoneys

export const PocketMoneys = pgTable("pocket_moneys", {
  pocketMoneyId: uuid("pocketMoneyId").primaryKey().defaultRandom(),
  recipientId: uuid("recipientId")
    .notNull()
    .references(() => Recipients.recipientId),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: ResourceStatus("status").default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
  updatedBy: varchar("updatedBy", { length: 255 }),
});

export const PocketMoneysRelations = relations(
  PocketMoneys,
  ({ one, many }) => ({
    recipient: one(Recipients, {
      fields: [PocketMoneys.recipientId],
      references: [Recipients.recipientId],
    }),
    transactions: many(Transactions),
  })
);

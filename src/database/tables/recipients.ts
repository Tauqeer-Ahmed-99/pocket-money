import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { ResourceStatus } from "../enums";

export const Recipients = pgTable("recipients", {
  recipientId: uuid("recipientId").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  amount: integer("amount").notNull(),
  status: ResourceStatus("status").default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
  updatedBy: varchar("updatedBy", { length: 255 }),
});

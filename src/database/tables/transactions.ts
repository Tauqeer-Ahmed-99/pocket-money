import {
  boolean,
  date,
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { ResourceStatus, TransactionStatus } from "../enums";
import { PocketMoneys } from "./pocket-moneys";
import { relations } from "drizzle-orm";

// Users => UserPMRecipients => Recipients => PocketMoneys => Transactions

export const Transactions = pgTable("transactions", {
  transactionId: uuid("transactionId").primaryKey().defaultRandom(),
  pocketMoneyId: uuid("pocketMoneyId")
    .notNull()
    .references(() => PocketMoneys.pocketMoneyId),

  mihpayid: text("mihpayid"),
  mode: text("mode"),
  txnStatus: TransactionStatus("txnStatus").notNull().default("pending"),
  unmappedstatus: text("unmappedstatus"),
  key: varchar("key", { length: 255 }).notNull(),
  paymentGatewayTxnId: varchar("paymentGatewayTxnId", {
    length: 255,
  }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }),
  net_amount_debit: decimal("net_amount_debit", { precision: 10, scale: 2 }),
  addedon: date("addedon"),
  productinfo: text("productinfo").notNull(),
  firstname: varchar("firstname", { length: 255 }).notNull(),
  lastname: varchar("lastname", { length: 255 }).notNull(),
  address1: varchar("address1", { length: 255 }),
  address2: varchar("address2", { length: 255 }),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  country: varchar("country", { length: 255 }),
  zipcode: varchar("zipcode", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  udf1: varchar("udf1", { length: 255 }),
  udf2: varchar("udf2", { length: 255 }),
  udf3: varchar("udf3", { length: 255 }),
  udf4: varchar("udf4", { length: 255 }),
  udf5: varchar("udf5", { length: 255 }),
  udf6: varchar("udf6", { length: 255 }),
  udf7: varchar("udf7", { length: 255 }),
  udf8: varchar("udf8", { length: 255 }),
  udf9: varchar("udf9", { length: 255 }),
  udf10: varchar("udf10", { length: 255 }),
  hash: text("hash").notNull(),
  field1: varchar("field1", { length: 255 }),
  field2: varchar("field2", { length: 255 }),
  field3: varchar("field3", { length: 255 }),
  field4: varchar("field4", { length: 255 }),
  field5: varchar("field5", { length: 255 }),
  field6: varchar("field6", { length: 255 }),
  field7: varchar("field7", { length: 255 }),
  field8: varchar("field8", { length: 255 }),
  field9: varchar("field9", { length: 255 }),
  payment_source: varchar("payment_source", { length: 255 }),
  pa_name: varchar("pa_name", { length: 255 }),
  PG_TYPE: varchar("PG_TYPE", { length: 255 }),
  bank_ref_num: varchar("bank_ref_num", { length: 255 }),
  bankcode: varchar("bankcode", { length: 255 }),
  error: varchar("error", { length: 255 }),
  error_Message: varchar("error_Message", { length: 255 }),

  receivedHash: text("receivedHash"),
  reverseHash: text("reverseHash"),
  isValidTxn: boolean("isValidTxn"),
  finalStatus: varchar("finalStatus", { length: 255 }),
  finalErrorMessage: varchar("finalErrorMessage", { length: 255 }),

  status: ResourceStatus("status").default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
  updatedBy: varchar("updatedBy", { length: 255 }),
});

export const TransactionsRelations = relations(Transactions, ({ one }) => ({
  pocketMoney: one(PocketMoneys, {
    fields: [Transactions.pocketMoneyId],
    references: [PocketMoneys.pocketMoneyId],
  }),
}));

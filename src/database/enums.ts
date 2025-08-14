import { pgEnum } from "drizzle-orm/pg-core";

export const ResourceStatus = pgEnum("ResourceStatus", [
  "active",
  "inactive",
  "archived",
]);

export const TransactionStatus = pgEnum("TransactionStatus", [
  "pending",
  "success",
  "error",
]);

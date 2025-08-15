ALTER TABLE "transactions" ADD COLUMN "receivedHash" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "reverseHash" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "isValidTxn" boolean;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "finalStatus" varchar(255);--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "finalErrorMessage" varchar(255);
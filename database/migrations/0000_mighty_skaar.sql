CREATE TYPE "public"."ResourceStatus" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TYPE "public"."TransactionStatus" AS ENUM('pending', 'success', 'error');--> statement-breakpoint
CREATE TABLE "users" (
	"userId" varchar(255) PRIMARY KEY NOT NULL,
	"firstname" varchar(255) NOT NULL,
	"lastname" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"addressLine1" varchar(255) NOT NULL,
	"addressLine2" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"region" varchar(255) NOT NULL,
	"postalCode" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_pm_recipients" (
	"userId" varchar(255) NOT NULL,
	"recipientId" uuid NOT NULL,
	"status" "ResourceStatus" DEFAULT 'active' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"createdBy" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"updatedBy" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "recipients" (
	"recipientId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"lastname" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"status" "ResourceStatus" DEFAULT 'active' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"createdBy" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"updatedBy" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "pocket_moneys" (
	"pocketMoneyId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipientId" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" "ResourceStatus" DEFAULT 'active' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"createdBy" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"updatedBy" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"transactionId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pocketMoneyId" uuid NOT NULL,
	"mihpayid" text,
	"mode" text,
	"txnStatus" "TransactionStatus" DEFAULT 'pending' NOT NULL,
	"unmappedstatus" text,
	"key" varchar(255) NOT NULL,
	"paymentGatewayTxnId" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"discount" numeric(10, 2),
	"net_amount_debit" numeric(10, 2),
	"addedon" date,
	"productinfo" text NOT NULL,
	"firstname" varchar(255) NOT NULL,
	"lastname" varchar(255) NOT NULL,
	"address1" varchar(255),
	"address2" varchar(255),
	"city" varchar(255),
	"state" varchar(255),
	"country" varchar(255),
	"zipcode" varchar(255),
	"email" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"udf1" varchar(255),
	"udf2" varchar(255),
	"udf3" varchar(255),
	"udf4" varchar(255),
	"udf5" varchar(255),
	"udf6" varchar(255),
	"udf7" varchar(255),
	"udf8" varchar(255),
	"udf9" varchar(255),
	"udf10" varchar(255),
	"hash" text NOT NULL,
	"field1" varchar(255),
	"field2" varchar(255),
	"field3" varchar(255),
	"field4" varchar(255),
	"field5" varchar(255),
	"field6" varchar(255),
	"field7" varchar(255),
	"field8" varchar(255),
	"field9" varchar(255),
	"payment_source" varchar(255),
	"pa_name" varchar(255),
	"PG_TYPE" varchar(255),
	"bank_ref_number" varchar(255),
	"bankcode" varchar(255),
	"error" varchar(255),
	"error_Message" varchar(255),
	"status" "ResourceStatus" DEFAULT 'active' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"createdBy" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT now(),
	"updatedBy" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "user_pm_recipients" ADD CONSTRAINT "user_pm_recipients_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_pm_recipients" ADD CONSTRAINT "user_pm_recipients_recipientId_recipients_recipientId_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."recipients"("recipientId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pocket_moneys" ADD CONSTRAINT "pocket_moneys_recipientId_recipients_recipientId_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."recipients"("recipientId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_pocketMoneyId_pocket_moneys_pocketMoneyId_fk" FOREIGN KEY ("pocketMoneyId") REFERENCES "public"."pocket_moneys"("pocketMoneyId") ON DELETE no action ON UPDATE no action;
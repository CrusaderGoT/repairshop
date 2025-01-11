CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar,
	"completed" boolean DEFAULT false NOT NULL,
	"tech" varchar DEFAULT 'unassigned' NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;
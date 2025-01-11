import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  varchar,
  integer
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  email: varchar("email").notNull().unique(),
  phone: varchar("phone").notNull().unique(),
  address: varchar("address").notNull(),
  city: varchar("city").notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zip: varchar("zip", { length: 10 }),
  notes: text("notes"),
  active: boolean("active").notNull().default(true),
  created: timestamp("timestamp").notNull().defaultNow(),
})

export const tickets = pgTable("customers", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  title: varchar("title").notNull(),
  description: varchar("description"),
  completed: boolean("completed").notNull().default(false),
  tech: varchar("tech").notNull().default("unassigned"),
  created: timestamp("timestamp").notNull().defaultNow(),
  updated: timestamp("updated").notNull().defaultNow().$onUpdate(() => new Date),
});


// Relations

export const customersRelations = relations(customers,
  ({ many}) => ({
    tickets: many(tickets),
  })
);

export const ticketsRelations = relations(tickets,
  ({ one }) => ({
    customer: one(customers, {
      fields: [tickets.customerId],
      references: [customers.id],
    }),
  })
);
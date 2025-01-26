import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { tickets } from "@/drizzle/schemas";
import { z } from "zod";

export const insertTicketSchema = createInsertSchema(tickets, {
    id: z.union([ z.number(), z.literal("New") ]),
    title: (schema) => schema.nonempty("Title is required"),
    description: (schema) => schema.nonempty("Description is required"),
    tech: (schema) => schema.email("Inalid email"),
});


export const selectTicketSchema = createSelectSchema(tickets);

export type selectTicketSchemaType = z.infer<typeof selectTicketSchema>;

export type insertTicketSchemaType = z.infer<typeof insertTicketSchema>;

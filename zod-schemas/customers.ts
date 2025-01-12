import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { customers } from "@/drizzle/schema";
import { z } from "zod";



export const insertCustomerSchema = createInsertSchema(customers, {
    firstName: (schema) => schema.min(2, "First Name Should be more than 2 letters")
    .regex(/^[a-zA-Z]$/, "First Name most contain only letters"),

    lastName: (schema) => schema.min(2, "Last Name Should be more than 2 letters")
    .regex(/^[a-zA-Z]$/, "First Name most contain only letters"),

    address: (schema) => schema.nonempty("adress is required"), 

    email: (schema) => schema.email("not a valid email"),
    
    city: (schema) => schema.nonempty("city is required"),

    state: (schema) => schema.max(2, "State should be exactly 2 characters"),

    zip: (schema) => schema.regex(/^\d{6}$/, "invalid zip code"),

    phone: (schema) => schema.regex(/^\+234|\d{1}-(\d{3})-(\d{4})$/, "invalid phone number format. Use +234-XXX-XXXX or 0-XXX-XXXX"),


});

export const selectCustomerSchema = createSelectSchema(customers);

export type insertCustomerSchemaType = z.infer<typeof insertCustomerSchema>;

export type selectCustomerSchemaType = z.infer<typeof selectCustomerSchema>;
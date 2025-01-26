"use server"

import { db } from "@/drizzle/db";
import { customers } from "@/drizzle/schemas";
import { eq, ilike, or } from "drizzle-orm";
import { flattenValidationErrors } from "next-safe-action";
import { redirect } from "next/navigation";
import { actionClient } from "@/lib/safe-action";
import { insertCustomerSchema, insertCustomerSchemaType } from "@/zod-schemas/customers";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { sql } from "drizzle-orm";

export async function getCustomer(id: number) {
    const [ Customer ] = await db.select()
    .from(customers)
    .where(eq(customers.id, id));

    return Customer;
}


export const saveCustomerAction = actionClient
    .metadata({ actionName: "saveCustomerAction" })
    .schema(insertCustomerSchema, {
        handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({
        parsedInput: customer
    }: { parsedInput: insertCustomerSchemaType }) => {
        
        const { isAuthenticated } = getKindeServerSession();
        const isAuth = await isAuthenticated();

        if (!isAuth) redirect("/login"); // not logged in

        // a new customer, because id is 0
        if (customer.id === 0) {
            const [ result ] = await db.insert(customers).values({
                firstName:customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                ...(customer.notes?.trim() ? { notes: customer.notes } : {}),
                city: customer.city,
                state: customer.state,
                zip: customer.zip,
                address: customer.address,
            }).returning({ insertedId: customers.id })

            return { messsage: `Customer ID #${result.insertedId} created sucessfully. ` }
        }

        // else an existing customer
        const [ result ] = await db.update(customers).set({
            firstName:customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            notes: customer.notes?.trim() ?? null,
            city: customer.city,
            state: customer.state,
            zip: customer.zip,
            address: customer.address,
        })
        .where(eq(customers.id, customer.id as number))
        .returning({ updatedId: customers.id })

        return { messsage: `Customer ID #${result.updatedId} edited successfully. ` }
    })

export async function getCustomerSearch(searchText: string) {
    const results = await db.select().from(customers)
        .where(
            or(
                ilike(customers.email, `%${searchText}%`),
                ilike(customers.phone, `%${searchText}%`),
                ilike(customers.zip, `%${searchText}%`),
                ilike(customers.city, `%${searchText}%`),
                sql`lower(concat(${customers.firstName}, ' ', ${customers.lastName})) 
                LIKE ${`%${searchText.toLowerCase().replace(' ', '%')}%`}`,
            )
        );
    
    return results;
}
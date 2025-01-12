import { db } from "@/drizzle/db";
import { customers, tickets } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getCustomer(id: number) {
    const [ Customer ] = await db.select()
    .from(customers)
    .where(eq(customers.id, id));

    return Customer;
}

export async function getticket(id: number) {
    const [ ticket ] = await db.select()
    .from(tickets)
    .where(eq(tickets.id, id));

    return ticket;
}
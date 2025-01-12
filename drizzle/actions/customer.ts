import { db } from "@/drizzle/db";
import { customers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getCustomer(id: number) {
    const [ Customer ] = await db.select()
    .from(customers)
    .where(eq(customers.id, id));

    return Customer;
}


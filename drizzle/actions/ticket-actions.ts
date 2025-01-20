"use server"

import { eq, ilike, or } from "drizzle-orm";
import { db } from "../db";
import { customers, tickets } from "../schema";
import { actionClient } from "@/lib/safe-action";
import { insertTicketSchemaType, insertTicketSchema } from "@/zod-schemas/tickets";
import { flattenValidationErrors } from "next-safe-action";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";


export async function getTicket(id: number) {
    const [ ticket ] = await db.select()
        .from(tickets)
        .where(eq(tickets.id, id));

    return ticket;
}

export const saveTicketAction = actionClient
    .metadata({ actionName: "saveTicketAction" })
    .schema(insertTicketSchema, {
        handleValidationErrorsShape: async (ve) => flattenValidationErrors(ve).fieldErrors,
    })
    .action(async ({
        parsedInput: ticket
    }: { parsedInput: insertTicketSchemaType }) => {
        
        const { isAuthenticated } = getKindeServerSession();
        const isAuth = await isAuthenticated();

        if (!isAuth) redirect("/login"); // not logged in

        // a new ticket, because id is 0
        if (ticket.id === "New") {
            const [ result ] = await db.insert(tickets).values({
                customerId: ticket.customerId,
                title: ticket.title,
                ...(ticket.description?.trim() ? {description: ticket.description} : {}),
                tech: ticket.tech,
                completed: ticket.completed,
            }).returning({ insertedId: tickets.id })

            return { messsage: `ticket ID #${result.insertedId} created sucessfully. ` }
        }

        // else an existing ticket
        const [ result ] = await db.update(tickets).set({
            title: ticket.title,
            description: ticket.description?.trim() ?? null,
            tech: ticket.tech,
            completed: ticket.completed,
        })
        .where(eq(tickets.id, ticket.id as number))
        .returning({ updatedId: tickets.id })

        return { messsage: `ticket ID #${result.updatedId} edited successfully. ` }
    })

export async function getTicketSearch(searchText: string) {
    const results = await db.select({
        ticketDate: tickets.created,
        title: tickets.title,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        tech: tickets.tech,

    })
        .from(tickets)
        .leftJoin(customers, eq(customers.id, tickets.customerId))
        .where(
            or(
                ilike(tickets.description, `%${searchText}%`),
                ilike(tickets.title, `%${searchText}%`),
                ilike(tickets.tech, `%${searchText}%`),
                ilike(customers.firstName, `%${searchText}%`),
                ilike(customers.lastName, `%${searchText}%`),
                ilike(customers.address, `%${searchText}%`),
                ilike(customers.email, `%${searchText}%`),
                ilike(customers.phone, `%${searchText}%`),
                ilike(customers.zip, `%${searchText}%`),
                ilike(customers.city, `%${searchText}%`),
                ilike(customers.state, `%${searchText}%`),
                ilike(customers.notes, `%${searchText}%`),
            )
        );
    
    return results;
}

export async function getOpenTickets() {
    const results = await db.select({
        ticketDate: tickets.created,
        title: tickets.title,
        firstName: customers.firstName,
        lastName: customers.lastName,
        email: customers.email,
        tech: tickets.tech,

    })
        .from(tickets)
        .leftJoin(customers, eq(tickets.customerId, customers.id))
        .where(eq(tickets.completed, false));
    
    return results;
}
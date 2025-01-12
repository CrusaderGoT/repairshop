"use client"

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTicketSchema, insertTicketSchemaType, selectTicketSchemaType } from "@/zod-schemas/tickets";
import { selectCustomerSchemaType } from "@/zod-schemas/customers";

type ticketProps = {
    customer:  selectCustomerSchemaType
    ticket?: selectTicketSchemaType,
}

export default function TicketForm({ customer, ticket }: ticketProps) {
    const defaultValues: insertTicketSchemaType = {
        id: ticket?.id ?? "New",
        title: ticket?.title ?? "",
        tech: ticket?.tech ?? "new-ticket@example.com",
        customerId: ticket?.customerId ?? customer.id,
        description: ticket?.description ?? "",
        completed: ticket?.completed ?? false,
    }

    const form = useForm<insertTicketSchemaType>({
        mode: "onBlur",
        resolver: zodResolver(insertTicketSchema),
        defaultValues,
    })

    async function submitForm(data: insertTicketSchemaType) {
        console.log(data)   
    }

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <div>
                <h2 className="text-2xl font-bold">
                    {ticket?.id ? "Edit" : "New"} Customer Form
                </h2>
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(submitForm)} className="flex fle-col sm:flex-row gap-4 sm:gap-4">
                        <p>
                            {JSON.stringify(form.getValues())}
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    );
}
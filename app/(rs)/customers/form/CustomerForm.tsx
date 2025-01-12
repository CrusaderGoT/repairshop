"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { insertCustomerSchema, insertCustomerSchemaType, selectCustomerSchemaType } from "@/zod-schemas/customers";

type customerProps = {
    customer?: selectCustomerSchemaType,
}

export default function CustomerForm({ customer }: customerProps) {
    const defaultValues: insertCustomerSchemaType = {
        id: customer?.id ?? 0,
        firstName: customer?.firstName ?? "",
        lastName: customer?.lastName ?? "",
        address: customer?.address ?? "",
        email: customer?.email ?? "",
        phone: customer?.phone ?? "",
        city: customer?.city ?? "",
        zip: customer?.zip ?? "",
        state: customer?.state ?? "",
        notes: customer?.notes ?? "",
    };

    const form = useForm<insertCustomerSchemaType>({
        mode: "onBlur",
        resolver: zodResolver(insertCustomerSchema),
        defaultValues,
    });

    async function submitForm(data: insertCustomerSchemaType) {
        console.log(data)
    }

    return (
        <div className="flex flex-col gap-1 sm:px-8">
            <div>
                <h2 className="text-2xl font-bold">
                    {customer?.id ? "Edit" : "New"} Customer Form
                </h2>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)} className="flex fle-col sm:flex-row gap-4 sm:gap-4">
                    <p>
                        {JSON.stringify(form.getValues())}
                    </p>
                </form>
            </Form>
        </div>
    )
}
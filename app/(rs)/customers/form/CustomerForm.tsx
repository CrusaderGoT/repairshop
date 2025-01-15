"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { insertCustomerSchema, insertCustomerSchemaType, selectCustomerSchemaType } from "@/zod-schemas/customers";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLable";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { CheckBoxWithLabel } from "@/components/inputs/CheckBoxWithLabel";
import { StateArray } from "@/constants/StatesArray";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

type customerProps = {
    customer?: selectCustomerSchemaType,
}

export default function CustomerForm({ customer }: customerProps) {
    const { getPermission, isLoading } = useKindeBrowserClient();
    const isManager = !isLoading && getPermission("manager")?.isGranted;

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
        active: customer?.active ?? true,
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
        <div className="flex flex-col gap-1 sm:px-8 p-4 border rounded">
            <div>
                <h2 className="text-2xl font-bold">
                    {customer?.id ? "Edit" : "New"} Customer {customer?.id ? `#${customer.id}` : 'Form'}
                </h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)} className="flex flex-col md:flex-row gap-4 md:gap-8 m-1 sm:m-3">

                    <div className="flex flex-col gap-4 w-full max-w-xs">

                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="First Name"
                            nameInSchema="firstName"
                        />

                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="Last Name"
                            nameInSchema="lastName"
                        />

                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="Address"
                            nameInSchema="address"
                        />

                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="City"
                            nameInSchema="city"
                        />

                        <SelectWithLabel<insertCustomerSchemaType>
                            fieldTitle="State"
                            nameInSchema="state"
                            data={StateArray}
                        />

                    </div>

                    <div className="flex flex-col gap-4 w-full max-w-xs">

                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="Zip Code"
                            nameInSchema="zip"
                        />

                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="Email"
                            nameInSchema="email"
                        />

                        <InputWithLabel<insertCustomerSchemaType>
                            fieldTitle="Phone Number"
                            nameInSchema="phone"
                        />

                        <TextAreaWithLabel<insertCustomerSchemaType>
                            fieldTitle="Notes"
                            nameInSchema="notes"
                            className="h-40"
                        />

                        {
                        isLoading ? null : isManager && customer?.id ? (
                            <CheckBoxWithLabel<insertCustomerSchemaType>
                            fieldTitle="Active"
                            nameInSchema="active"
                            message="Yes"
                            />
                        ) : null
                        }

                        <div className="flex gap-2">

                            <Button
                                type="submit"
                                className="w-3/4"
                                variant="default"
                                title="save"
                            >Save</Button>

                            <Button
                                type="button"
                                variant="destructive"
                                title="Reset"
                                onClick={() => form.reset(defaultValues)}
                            >Reset</Button>

                        </div>

                    </div>

                    

                </form>
            </Form>
        </div>
    )
}
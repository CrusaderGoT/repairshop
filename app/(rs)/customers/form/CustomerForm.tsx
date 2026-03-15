"use client";

import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";
import { CheckBoxWithLabel } from "@/components/inputs/CheckBoxWithLabel";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLable";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { StateArray } from "@/constants/StatesArray";
import { saveCustomerAction } from "@/drizzle/actions/customer-actions";
import { useToast } from "@/hooks/use-toast";
import {
    insertCustomerSchema,
    insertCustomerSchemaType,
    selectCustomerSchemaType,
} from "@/zod-schemas/customers";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type customerProps = {
    customer?: selectCustomerSchemaType;
    isManager?: boolean | undefined;
};

export default function CustomerForm({ customer, isManager }: customerProps) {
    const { toast } = useToast();

    const searchParams = useSearchParams();
    const hasCustomerId = searchParams.has("customerId");

    const emptyValues: insertCustomerSchemaType = {
        id: 0,
        firstName: "",
        lastName: "",
        address: "",
        email: "",
        phone: "",
        city: "",
        zip: "",
        state: "",
        notes: "",
        active: true,
    };

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

    useEffect(() => {
        form.reset(hasCustomerId ? defaultValues : emptyValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.get("customerId")]);

    const {
        execute: executeSave,
        result: saveResult,
        isPending: isSaving,
        reset: resetSaveAction,
    } = useAction(saveCustomerAction, {
        onError() {
            //toast user
            toast({
                variant: "destructive",
                title: "Error! ❌",
                description: "Save Failed",
            });
        },
        onSuccess({ data }) {
            if (data?.messsage) {
                //toast user
                toast({
                    variant: "default",
                    title: "Success! 🎉",
                    description: data?.messsage,
                });
            }
        },
    });

    async function submitForm(data: insertCustomerSchemaType) {
        executeSave(data);
    }

    return (
        <div className="flex flex-col gap-1 sm:px-8 p-4 border rounded">
            <DisplayServerActionResponse result={saveResult} />
            <div>
                <h2 className="text-2xl font-bold">
                    {customer?.id ? "Edit" : "New"} Customer{" "}
                    {customer?.id ? `#${customer.id}` : "Form"}
                </h2>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submitForm)}
                    className="flex flex-col md:flex-row gap-4 md:gap-8 m-1 sm:m-3"
                >
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

                        {isManager && customer?.id ? (
                            <CheckBoxWithLabel<insertCustomerSchemaType>
                                fieldTitle="Active"
                                nameInSchema="active"
                                message="Yes"
                            />
                        ) : null}

                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                className="w-3/4"
                                variant="default"
                                title="Save"
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <LoaderCircle className="animate-spin" />{" "}
                                        Saving
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="destructive"
                                title="Reset"
                                onClick={() => {
                                    form.reset(defaultValues);
                                    resetSaveAction();
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}

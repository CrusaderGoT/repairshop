"use client"

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTicketSchema, insertTicketSchemaType, selectTicketSchemaType } from "@/zod-schemas/tickets";
import { selectCustomerSchemaType } from "@/zod-schemas/customers";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLable";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { CheckBoxWithLabel } from "@/components/inputs/CheckBoxWithLabel";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";
import { saveTicketAction } from "@/drizzle/actions/ticket-actions";



type ticketProps = {
    customer:  selectCustomerSchemaType
    ticket?: selectTicketSchemaType,
    techs?: {
        id: string,
        description: string
    }[],
    isEditable?: boolean,
}

export default function TicketForm({ customer, ticket, techs, isEditable = true }: ticketProps) {

    const isManager = Array.isArray(techs);

    const { toast } = useToast();

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

    const {
        execute: executeSave,
        result: saveResult,
        isPending: isSaving,
        reset: resetSaveAction,
    } = useAction(saveTicketAction, {
        onError() {
            //toast user
            toast({
                variant: "destructive",
                title: "Error! ❌",
                description: "Save Failed",
            })
        },
        onSuccess({ data }) {
            if (data?.messsage) {
                //toast user
                toast({
                    variant: "default",
                    title: "Success! 🎉",
                    description: data.messsage,
                })
            }   
        },
    });

    async function submitForm(data: insertTicketSchemaType) {
        executeSave(data); 
    }

    return (
        <div className="flex flex-col gap-1 sm:px-8 p-4 border rounded">
            <DisplayServerActionResponse result={saveResult} />
            <div>
                <h2 className="text-2xl font-bold">
                    {ticket?.id && isEditable ? `Edit Ticket #${ticket.id}`
                        : ticket?.id ? `View Ticket #${ticket.id}`
                            :  "New Ticket Form"}
                </h2>
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(submitForm)} className="flex flex-col md:flex-row gap-4 md:gap-8 m-1 sm:m-3">

                        <div className="flex flex-col gap-4 w-full max-w-xs">

                            <InputWithLabel<insertTicketSchemaType>
                                fieldTitle="Title"
                                nameInSchema="title"
                                disabled={!isEditable}
                            />
                            
                            {isManager ? (
                                <SelectWithLabel<insertTicketSchemaType>
                                    fieldTitle="Tech Id"
                                    nameInSchema="tech"
                                    data={[{id: "new-tickets@example.com", description: "new-tickets@example.com"}, ...techs]}
                                />
                            ) : (
                                <InputWithLabel<insertTicketSchemaType>
                                fieldTitle="Tech"
                                nameInSchema="tech"
                                disabled
                                />
                            )}
                            
                            {ticket?.id ? (
                                <CheckBoxWithLabel<insertTicketSchemaType>
                                fieldTitle="Completed"
                                nameInSchema="completed"
                                message="Yes"
                                disable={!isEditable}
                                />
                            ): null}
                            

                            <div className="mt-4 space-y-2">

                                <h3 className="text-lg">
                                    Customer Info
                                </h3>

                                <hr className="w-4/5" />

                                <p>
                                    {customer.firstName} {customer.lastName}
                                </p>

                                <p>
                                    {customer.address}
                                </p>

                                <p>
                                    {customer.city}, {customer.state} {customer.zip}
                                </p>

                                <hr className="w-4/5" />

                                <p>{customer.email}</p>

                                <p>{customer.phone}</p>

                            </div>

                        </div>
                        
                        <div className="flex flex-col gap-4 w-full max-w-xs">

                            <TextAreaWithLabel<insertTicketSchemaType>
                                fieldTitle="Description"
                                nameInSchema="description"
                                className="h-96"
                                disabled={!isEditable}
                            />

                            {isEditable ? (
                                <div className="flex gap-2">

                                    <Button
                                        type="submit"
                                        className="w-3/4"
                                        variant="default"
                                        title="save"
                                        disabled={isSaving}
                                    >
                                        {
                                        isSaving ? (
                                            <>
                                                <LoaderCircle className="animate-spin" /> Saving
                                            </>
                                        ) : "Save"}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        title="Reset"
                                        onClick={() => {
                                            form.reset(defaultValues);
                                            resetSaveAction();
                                        }}
                                    >Reset</Button>

                                </div>
                            ) : null}
                            

                        </div>
                        
                    </form>
                </Form>
            </div>
        </div>
    );
}
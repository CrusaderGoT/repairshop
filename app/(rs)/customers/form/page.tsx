import { BackButton } from "@/components/BackButton";
import { getCustomer } from "@/drizzle/actions/customer";
import CustomerForm from "./CustomerForm";

export default async function CustomerFormPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    try {

        const { customerId } = await searchParams

        // Edit Form if Customer
        if (customerId) {
            const customer = await getCustomer(parseInt(customerId));

            if (!customer) {
                return (
                    <>
                    <h2 className="text-2xl mb-2">Customer ID #{customerId} not found.</h2>
                    
                    <BackButton title="Go Back" variant={"secondary"} />
                    </>
                );
            } else {
                // edit customer form
                return <CustomerForm customer={customer} />
            }
        } else {
            // new customer form
            return <CustomerForm />
        }
        

    } catch (e) {
        if (e instanceof Error) {
            throw e;
        }
    }
}
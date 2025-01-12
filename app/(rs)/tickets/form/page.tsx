import { getTicket } from "@/drizzle/actions/tickets";
import { BackButton } from "@/components/BackButton";
import TicketForm from "./TicketForm";
import { getCustomer } from "@/drizzle/actions/customer";

export default async function TicketFormPage({
    searchParams,
}: {searchParams: Promise<{ [key: string]: string | undefined }>}) {

    try {
        const { ticketId, customerId } = await searchParams;

        if (!ticketId && !customerId) {
            return (
                <>
                    <h2 className="text-2xl mb-2">
                        Customer ID or Ticket ID required to load ticket.
                    </h2>
                    <BackButton title="Go Back" variant="secondary" />
                </>
            );
        }

        // New ticket form
        if (customerId) {
            const customer = await getCustomer(parseInt(customerId));

            if (!customer) { 
                return (
                    <>
                        <h2 className="text-2xl mb-2">
                            Customer ID #{customerId} not found.
                        </h2>
                        <BackButton title="Go Back" variant="ghost" />
                    </>
                );
            }

            if (!customer.id) {
                return (
                    <>
                        <h2 className="text-2xl mb-2">
                            Customer ID #{customerId} number is not active.
                        </h2>
                        <BackButton title="Go Back" variant="ghost" />
                    </>
                );
            }

            // return new ticket form
            return <TicketForm customer={customer} />
        }

        if (ticketId) {
            const ticket = await getTicket(parseInt(ticketId));
            if (!ticket) {
                return (
                    <>
                        <h2 className="text-2xl mb-2">
                            Ticket ID #{customerId} not found.
                        </h2>
                        <BackButton title="Go Back" variant="ghost" />
                    </>
                );
            }
            const customer = await getCustomer(ticket.customerId)

            // return edit ticket form
            return <TicketForm customer={customer} ticket={ticket} />
        }

            
    } catch (e) {
        if (e instanceof Error) {
            throw e;
        }
    }

    
    


}
import { getTicket } from "@/drizzle/actions/ticket-actions";
import { BackButton } from "@/components/BackButton";
import TicketForm from "./TicketForm";
import { getCustomer } from "@/drizzle/actions/customer-actions";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Users, init as kindeInit } from "@kinde/management-api-js"

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { customerId, ticketId } = await searchParams;
     
    if (!customerId && !ticketId) return {
        title: "Missing Ticket ID or Customer ID"
    }

    if (customerId) return {
        title: `New Ticket for Customer #${customerId}`
    }

    if (ticketId) return {
        title: `Edit or View Ticket #${ticketId}`
    }
}

export default async function TicketFormPage({
    searchParams,
}: {searchParams: Promise<{ [key: string]: string | undefined }>}) {

    try {
        const { ticketId, customerId } = await searchParams;

        const { getPermission, getUser } = getKindeServerSession();

        const [ managerPermission, user ] = await Promise.all([
            getPermission("manager"),
            getUser()
        ]);

        const isManager = managerPermission?.isGranted;

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

            if (!customer.active) {
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
            if (isManager) {
                kindeInit(); // initialiazes the kinde management server api

                const { users } = await Users.getUsers();

                const techs = users ? users.map(user => ({
                    id: user.email?.toLowerCase() as string, description:user.email?.toLowerCase() as string
                })) : [];

                return <TicketForm customer={customer} techs={techs} isManager={isManager} />

            } else {
                return <TicketForm customer={customer} />
            }
            
            
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
            if (isManager) {
                kindeInit(); // initialiazes the kinde management server api

                const { users } = await Users.getUsers();

                const techs = users ? users.map(user => ({
                    id: user.email as string, description:user.email as string
                })) : [];

                return <TicketForm customer={customer} techs={techs} ticket={ticket} isManager={isManager} />

            } else {
                const isEditable = user?.email?.toLowerCase() === ticket.tech.toLowerCase();

                return <TicketForm customer={customer} ticket={ticket} isEditable={isEditable} />
            }
        }

            
    } catch (e) {
        if (e instanceof Error) {
            throw e;
        }
    }

    
    


}
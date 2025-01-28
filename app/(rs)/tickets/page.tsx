import TicketSearch from "./TicketSearch";
import { getOpenTickets, getTicketSearch } from "@/drizzle/actions/ticket-actions";
import TicketTable from "./TicketTable";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { searchText } = await searchParams;
     
    if (!searchText) return { title: "Tickets Page" };

    return { title: `Search Ticket: ${searchText}` };
}

export default async function Tickets({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { searchText } = await searchParams;

    if (!searchText) {
        // query default results
        const results = await getOpenTickets();
        return (
            <>
                <TicketSearch />
                {
                results.length ? <TicketTable data={results} /> : <p className="mt-4">No open tickets found</p>
                }
            </>
        )
    }

    const results = await getTicketSearch(searchText)

    return (
        <>
            <TicketSearch />
            {
                results.length ? <TicketTable data={results} /> : <p className="mt-4">No tickets found</p>
            }
        </>
    )
}
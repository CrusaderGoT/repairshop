import TicketSearch from "./TicketSearch";
import { getOpenTickets, getTicketSearch } from "@/drizzle/actions/ticket-actions";

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
                <p>{JSON.stringify(results)}</p>
            </>
        )
    }

    const results = await getTicketSearch(searchText)

    return (
        <>
            <TicketSearch />
            <p>
                {JSON.stringify(results)}
            </p>
        </>
    )
}
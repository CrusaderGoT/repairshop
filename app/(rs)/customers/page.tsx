import CustomerSearch from "./CustomerSearch";
import { getCustomerSearch } from "@/drizzle/actions/customer-actions";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { searchText } = await searchParams;
     
    if (!searchText) return { title: "Customer Page" };

    return { title: `Search Customer: ${searchText}` };
}

export default async function Customers({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const { searchText } = await searchParams;
    
    if (!searchText) return <CustomerSearch />;

    const results = await getCustomerSearch(searchText);

    return (
        <>
            <CustomerSearch />
            <p>
                {JSON.stringify(results)}
            </p>
        </>
    )
}
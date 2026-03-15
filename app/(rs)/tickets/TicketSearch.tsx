import Form from "next/form";
import { SearchButton } from "@/components/SearchButton";
import { Input } from "@/components/ui/input";

export default function TicketSearch() {
    return (
        <Form
            action={"/tickets"}
            className="flex gap-2 items-center"
        >
            <Input
                name="searchText"
                type="text"
                placeholder="Search Tickets"
                className="w-full"
                autoFocus
            />

            <SearchButton />

        </Form>
    )
}
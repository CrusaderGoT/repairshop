"use client"

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { SearchIcon } from "lucide-react";


export function SearchButton() {
    const status = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={status.pending}
            className="w-fit"
            title={status.pending ? "Searching" : "Search"}
        >
            {
                status.pending ? ( <LoaderCircle className="animate-spin" /> ) : ( <SearchIcon /> )
            }
        </Button>
    )
}
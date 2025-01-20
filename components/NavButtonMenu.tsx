import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NavMenuProps = {
    icon: LucideIcon,
    label: string,
    choices: {
        title: string,
        href: string,
    }[]
}

export function NavButtonMenu({
    icon: Icon,
    label,
    choices,
}: NavMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"link"}
                    size={"icon"}
                    className="rounded-full"
                >
                    <Icon className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">{label}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {choices.map(choice => (
                    <DropdownMenuItem key={choice.title} asChild>
                        <Link href={choice.href}>{choice.title}</Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
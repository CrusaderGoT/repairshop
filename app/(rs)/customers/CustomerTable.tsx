"use client";

import type { selectCustomerSchemaType } from "@/zod-schemas/customers";

import {
    CellContext,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, TableOfContents } from "lucide-react";
import Link from "next/link";

type TableProps = {
    data: selectCustomerSchemaType[];
};

export default function CustomerTable({ data }: TableProps) {
    const columnHeaderArray: Array<keyof selectCustomerSchemaType> = [
        "firstName",
        "lastName",
        "phone",
        "city",
        "zip",
    ];

    const columnHelper = createColumnHelper<selectCustomerSchemaType>();

    const ActionCell = ({
        row,
    }: CellContext<selectCustomerSchemaType, unknown>) => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>
                        <span className="sr-only">Open Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link
                            href={`/tickets/form?customerId=${row.original.id}`}
                            className="w-full"
                            prefetch={false}
                        >
                            New Ticket
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link
                            href={`/customers/form?customerId=${row.original.id}`}
                            className="w-full"
                            prefetch={false}
                        >
                            Edit Customer
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    ActionCell.displayName = "ActionsCell";

    const columns = [
        columnHelper.display({
            id: "actions",
            header: () => <TableOfContents />,
            cell: ActionCell,
        }),
        ...columnHeaderArray.map((columnName) => {
            return columnHelper.accessor(columnName, {
                id: columnName,
                header: columnName[0].toLocaleUpperCase() + columnName.slice(1),
            });
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="mt-6 border border-border rounded-lg overflow-hidden">
            <Table className="border">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className={`bg-secondary ${
                                        header.id === "actions" ? "w-12" : ""
                                    }`}
                                >
                                    <div
                                        className={`${
                                            header.id === "actions"
                                                ? "flex justify-center items-center"
                                                : ""
                                        }`}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            className="cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className="border">
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

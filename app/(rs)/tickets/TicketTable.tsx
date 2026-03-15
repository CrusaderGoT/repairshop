"use client";

import type { TicketSearchType } from "@/drizzle/actions/ticket-actions";

import {
    ColumnFiltersState,
    SortingState,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
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

import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    CircleCheckIcon,
    CircleXIcon,
} from "lucide-react";

import Filter from "@/components/react-table/Filter";
import { Button } from "@/components/ui/button";
import { usePooling } from "@/hooks/use-pooling";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type TableProps = {
    data: TicketSearchType;
};

type RowType = TicketSearchType[0];

export default function TicketTable({ data }: TableProps) {
    const router = useRouter();
    const searchParam = useSearchParams();

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "ticketDate",
            desc: true, // false for ascendending
        },
    ]);

    usePooling(searchParam.get("searchText"));

    const pageIndex = useMemo(() => {
        const page = searchParam.get("page");
        return page ? parseInt(page) - 1 : 0;
    }, [searchParam]);

    const columnHeaderArray: Array<keyof RowType> = [
        "ticketDate",
        "title",
        "tech",
        "firstName",
        "lastName",
        "email",
        "completed",
    ];

    const columnWidths = {
        completed: 150,
        ticketDate: 150,
        title: 250,
        tech: 250,
        email: 250,
    };

    const columnHelper = createColumnHelper<RowType>();

    const columns = columnHeaderArray.map((columnName) => {
        return columnHelper.accessor(
            (row) => {
                // transformational
                const value = row[columnName];

                if (columnName === "ticketDate" && value instanceof Date) {
                    return value.toLocaleDateString("en-Us", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    });
                }

                if (columnName === "completed") {
                    return value ? "CLOSED" : "OPEN";
                }

                return value;
            },
            {
                id: columnName,
                size: columnWidths[
                    (columnName as keyof typeof columnWidths) ?? undefined
                ],
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            className="pl-1 w-full flex justify-between"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            {columnName[0].toUpperCase() + columnName.slice(1)}

                            {column.getIsSorted() === "asc" && (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            )}

                            {column.getIsSorted() === "desc" && (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            )}

                            {column.getIsSorted() !== "desc" &&
                                column.getIsSorted() !== "asc" && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                )}
                        </Button>
                    );
                },
                cell: ({ getValue }) => {
                    // presentation
                    const value = getValue();

                    if (columnName === "completed") {
                        return (
                            <div className="grid place-content-center">
                                {value === "OPEN" ? (
                                    <CircleXIcon className="opacity-25" />
                                ) : (
                                    <CircleCheckIcon className="text-green-600" />
                                )}
                            </div>
                        );
                    }
                    return value;
                },
            }
        );
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            pagination: {
                pageIndex: pageIndex,
                pageSize: 10,
            },
        },
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getSortedRowModel: getSortedRowModel(),
    });

    useEffect(() => {
        const currentPageIndex = table.getState().pagination.pageIndex;
        const pageCount = table.getPageCount();

        if (pageCount <= currentPageIndex && pageIndex > 0) {
            const params = new URLSearchParams(searchParam.toString());
            params.set("page", "1");
            router.replace(`?${params.toString()}`, { scroll: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table.getState().columnFilters]);

    return (
        <div className="mt-6 gap-4">
            <div className="border border-border rounded-lg overflow-hidden">
                <Table className="border">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="bg-secondary p-1"
                                        style={{ width: header.getSize() }}
                                    >
                                        <div>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </div>

                                        {header.column.getCanFilter() ? (
                                            <div className="grid place-content-start">
                                                <Filter
                                                    column={header.column}
                                                    filteredRows={table
                                                        .getFilteredRowModel()
                                                        .rows.map((row) =>
                                                            row.getValue(
                                                                header.column.id
                                                            )
                                                        )}
                                                />
                                            </div>
                                        ) : null}
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
                                onClick={() =>
                                    router.push(
                                        `/tickets/form?ticketId=${row.original.id}`
                                    )
                                }
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

            <div className="justify-between items-center flex p-1 gap-1 flex-wrap">
                <div>
                    <p className="whitespace-nowrap font-bold">
                        {`Page ${
                            table.getState().pagination.pageIndex + 1
                        } of ${Math.max(1, table.getPageCount())}`}
                        &nbsp;&nbsp;
                        {`[${table.getFilteredRowModel().rows.length} ${
                            table.getFilteredRowModel().rows.length !== 1
                                ? "total results"
                                : "result"
                        }]`}
                    </p>
                </div>

                <div className="flex gap-1">
                    <div className="flex gap-1">
                        <Button
                            variant={"outline"}
                            onClick={() => table.resetColumnFilters()}
                        >
                            Reset Filter
                        </Button>

                        <Button
                            variant={"outline"}
                            onClick={() => table.resetSorting()}
                        >
                            Reset Sorting
                        </Button>

                        <Button
                            variant={"outline"}
                            onClick={() => router.refresh()}
                        >
                            Refresh Data
                        </Button>
                    </div>

                    <div className="flex gap-1">
                        <Button
                            variant={"outline"}
                            onClick={() => {
                                const newIndex =
                                    table.getState().pagination.pageIndex - 1;
                                table.setPageIndex(newIndex);
                                const params = new URLSearchParams(
                                    searchParam.toString()
                                );
                                params.set("page", (newIndex + 1).toString());
                                router.replace(`?${params.toString()}`, {
                                    scroll: false,
                                });
                            }}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>

                        <Button
                            variant={"outline"}
                            onClick={() => {
                                const newIndex =
                                    table.getState().pagination.pageIndex + 1;
                                table.setPageIndex(newIndex);
                                const params = new URLSearchParams(
                                    searchParam.toString()
                                );
                                params.set("page", (newIndex + 1).toString());
                                router.replace(`?${params.toString()}`, {
                                    scroll: false,
                                });
                            }}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

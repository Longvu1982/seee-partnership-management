import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  useReactTable,
} from "@tanstack/react-table";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useMediaQuery from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { DataTablePagination } from "./DataTablePagination";
import { useLoading } from "@/store/loading";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  manualPagination?: boolean;
  pagination?: { pageIndex: number; pageSize: number; totalCount: number };
  onPaginationChange?: (value: { pageIndex: number; pageSize: number }) => void;
  showPagination?: boolean;
  selectedRows?: RowSelectionState;
  onRowSelectionChange?: (newSelection: RowSelectionState) => void;
  meta?: A;
  enableRowSelection?: (row: Row<TData>) => boolean;
}
interface DefaultData {
  id?: string;
}

export function DataTable<TData extends DefaultData, TValue>({
  columns,
  data,
  pagination: externalPagination,
  onPaginationChange,
  manualPagination = false,
  showPagination = true,
  selectedRows: externalSelectedRows,
  onRowSelectionChange,
  meta,
  enableRowSelection,
}: DataTableProps<TData, TValue>) {
  const isMedium = useMediaQuery(768);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [internalPagination, setInternalPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 20, //default page size
    totalCount: undefined,
  });

  const { isLoading } = useLoading();

  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});

  const pagination = manualPagination ? externalPagination : internalPagination;
  const setPagination = manualPagination
    ? onPaginationChange
    : setInternalPagination;

  const rowSelection = externalSelectedRows ?? internalRowSelection;
  const setRowSelection = onRowSelectionChange ?? setInternalRowSelection;

  useEffect(() => {
    const availableRowIds = data.map((row) => row.id);
    const filteredSelection = Object.keys(rowSelection).filter((id) =>
      availableRowIds.includes(id)
    );
    const selectionState = filteredSelection.reduce(
      (acc, id) => ({ ...acc, [id]: true }),
      {}
    );

    // Only update if the selection actually changed
    const hasSelectionChanged =
      filteredSelection.length !== Object.keys(rowSelection).length;
    if (hasSelectionChanged) {
      setRowSelection(selectionState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setRowSelection]);

  const refinedColumns: ColumnDef<TData, TValue>[] = useMemo(() => {
    if (externalSelectedRows)
      return [
        {
          id: "select",
          header: ({ table }) => {
            let checked: boolean | "indeterminate" =
              table.getIsAllPageRowsSelected();
            if (table.getIsSomePageRowsSelected()) checked = "indeterminate";

            return (
              <Checkbox
                checked={checked}
                onCheckedChange={(value) =>
                  table.toggleAllRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            );
          },
          cell: ({ row }) => (
            <div className="w-[35px]">
              <Checkbox
                disabled={!row.getCanSelect()}
                checked={row.getIsSelected()}
                onCheckedChange={row.getToggleSelectedHandler()}
                aria-label="Select row"
              />
            </div>
          ),
        },
        ...columns,
      ];

    return columns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!externalSelectedRows, columns]);

  const tableSettings: TableOptions<TData> = {
    data,
    columns: refinedColumns,
    defaultColumn: {
      size: "auto" as A,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: (updater) => {
      if (typeof updater !== "function") return;
      const nextState = updater(pagination as PaginationState);
      setPagination?.(nextState as A);
    },

    onRowSelectionChange: (updater) => {
      const availableRowIds = data.map((row) => row.id);
      const newSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;
      const filteredSelection = Object.keys(newSelection).filter((id) =>
        availableRowIds.includes(id)
      );
      const selectionState = filteredSelection.reduce(
        (acc, id) => ({ ...acc, [id]: true }),
        {}
      );
      setRowSelection(selectionState);
    },

    manualPagination,
    rowCount: pagination?.totalCount,
    state: {
      sorting,
      rowSelection,
      pagination,
    },
    getRowId: (row) => row.id as string,
    meta,
    enableRowSelection,
  };

  const table = useReactTable(tableSettings);

  if (!table.getRowModel().rows?.length && !isLoading)
    return <p className="text-left mb-4">Không có dữ liệu</p>;

  return (
    <div>
      {showPagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <DataTablePagination table={table} />
        </div>
      )}

      {isMedium && (
        <div className="rounded-md border-2 overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const fixed = (header.column.columnDef as A)
                      .fixed as boolean;
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "border-r dark:border-gray-700 whitespace-nowrap",
                          fixed
                            ? "sticky right-0 bg-background drop-shadow-md dark:drop-shadow-border dark:drop-shadow-md hover:bg-muted/50"
                            : ""
                        )}
                        style={{
                          minWidth: header.column.columnDef.size ?? "auto",
                          maxWidth: header.column.columnDef.size ?? "auto",
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table
                  .getRowModel()
                  .rows.map((row: Row<TData>, index: number) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        index === table.getState().pagination.pageIndex &&
                          "animate-blink"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const fixed = (cell.column.columnDef as A)
                          .fixed as boolean;
                        return (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              "border-r dark:border-gray-700",
                              fixed
                                ? "sticky right-0 bg-background drop-shadow-md dark:drop-shadow-border dark:drop-shadow-md"
                                : ""
                            )}
                            style={{
                              minWidth: cell.column.columnDef.size ?? "auto",
                              maxWidth: cell.column.columnDef.size ?? "auto",
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {!isMedium && (
        <div className="space-y-4">
          {table.getRowModel().rows.map((row) => {
            const headers = table.getHeaderGroups()?.[0]?.headers ?? [];

            return (
              <Card key={row.id} className="shadow-md border border-black">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {row.getVisibleCells().map((cell) => {
                      const header = headers.find(
                        (item) => item.id === cell.column.id
                      );
                      return (
                        <div key={cell.id} className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            {header?.isPlaceholder
                              ? null
                              : flexRender(
                                  header?.column.columnDef.header,
                                  header?.getContext?.() as A
                                )}
                          </p>
                          <div className="text-sm">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        {showPagination && <DataTablePagination table={table} />}
      </div>
    </div>
  );
}

import { DataTable } from "@/components/data-table/DataTable";
import type { EnhancedColumnDef } from "@/components/data-table/dataTable.utils";
import { Button } from "@/components/ui/button";
import { useGetInitData } from "@/hooks/use-get-init-data";
import { usePagination } from "@/hooks/use-pagination";
import { apiListEvents } from "@/services/main/eventServices";
import {
  initQueryParams,
  type QueryDataModel,
  type EventResponse,
} from "@/types/model/app-model";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";

const columns: EnhancedColumnDef<EventResponse>[] = [
  {
    id: "STT",
    header: "STT",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
  },
  {
    accessorKey: "description",
    header: "Mô tả",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
  },
  {
    accessorKey: "startDate",
    header: "Ngày bắt đầu",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.startDate
            ? new Date(row.original.startDate).toLocaleDateString("vi-VN")
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: "Ngày kết thúc",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.endDate
            ? new Date(row.original.endDate).toLocaleDateString("vi-VN")
            : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    fixed: true,
    size: 120,
    enableResizing: false,
    cell: ({ row, table }) => {
      const onEditClick = (table.options.meta as A)?.onEditClick;
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEditClick(row.original)}
          >
            <Edit />
          </Button>
          <Button variant="outline" size="icon">
            <Trash className="text-red-500" />
          </Button>
        </div>
      );
    },
  },
];

const EventListPage = () => {
  const [eventList, setEventList] = useState<EventResponse[]>([]);
  const [queryParams, setQueryParams] =
    useState<QueryDataModel>(initQueryParams);

  const getEventList = async (params: QueryDataModel) => {
    const { data } = await apiListEvents(params);
    if (data.success) {
      setEventList(data.data.events ?? []);
      setQueryParams((prev) => ({
        ...prev,
        ...params,
        pagination: {
          ...params.pagination,
          totalCount: data.data.totalCount,
        },
      }));
    }
  };

  const { onPaginationChange } = usePagination({
    queryParams,
    fetchData: getEventList,
  });

  useGetInitData(() => getEventList(initQueryParams));

  return (
    <div className="overflow-x-auto">
      <DataTable
        data={eventList}
        columns={columns}
        manualPagination
        pagination={queryParams.pagination}
        onPaginationChange={onPaginationChange}
      />
    </div>
  );
};

export default EventListPage;

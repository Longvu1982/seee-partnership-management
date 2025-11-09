import { DataTable } from "@/components/data-table/DataTable";
import type { EnhancedColumnDef } from "@/components/data-table/dataTable.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetInitData } from "@/hooks/use-get-init-data";
import { usePagination } from "@/hooks/use-pagination";
import { useTriggerLoading } from "@/hooks/use-trigger-loading";
import {
  apiCreateEvent,
  apiListEvents,
  apiUpdateEvent,
} from "@/services/main/eventServices";
import {
  initQueryParams,
  type EventFormValues,
  type EventResponse,
  type QueryDataModel,
} from "@/types/model/app-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getEventStatusBadge } from "./event.utils";
import EventPanel, { initFormValues, schema } from "./panel/EventPanel";
import { Link } from "react-router-dom";

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
    cell: ({ row, getValue }) => {
      return (
        <Link
          to={`/event-detail/${row.original.id}`}
          className="hover:underline text-primary font-semibold"
        >
          {getValue() as string}
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      const { variant, text } = getEventStatusBadge(status);
      return <Badge variant={variant}>{text}</Badge>;
    },
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

  const [panelState, setPanelState] = useState<{
    isOpen: boolean;
    type: "create" | "edit";
  }>({ isOpen: false, type: "create" });

  const { triggerLoading } = useTriggerLoading();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...initFormValues },
  });

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

  const onEditClick = (row: EventFormValues) => {
    form.reset({
      ...row,
      startDate: row.startDate ? new Date(row.startDate) : null,
      endDate: row.endDate ? new Date(row.endDate) : null,
      contactIds: row.eventContacts
        ? row.eventContacts.map((item) => item.contact.id)
        : [],
      partnerIds: row.partnerEvents
        ? row.partnerEvents.map((item) => item.partner.id)
        : [],
    });
    setPanelState({ isOpen: true, type: "edit" });
  };

  const onCreateUpdate = async (data: EventFormValues) => {
    const method =
      panelState.type === "create" ? apiCreateEvent : apiUpdateEvent;

    await triggerLoading(async () => {
      const resp = await method(data);
      if (resp.data?.success) {
        toast.success(
          panelState.type === "create"
            ? "Thêm sự kiện thành công"
            : "Cập nhật sự kiện thành công"
        );
        setPanelState((prev) => ({ ...prev, isOpen: false }));
        await getEventList(queryParams);
      }
    });
  };

  const { onPaginationChange } = usePagination({
    queryParams,
    fetchData: getEventList,
  });

  useGetInitData(() => getEventList(initQueryParams));

  return (
    <>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
        Danh sách sự kiện
      </h3>

      <Button
        size="sm"
        className="mb-6"
        onClick={() => {
          setPanelState((prev) => ({
            ...prev,
            type: "create",
            isOpen: true,
          }));
          form.reset({ ...initFormValues });
        }}
      >
        <PlusCircle /> Thêm sự kiện
      </Button>

      {queryParams.pagination.totalCount > 0 && (
        <p className="">
          Số lượng: <strong>{queryParams.pagination.totalCount}</strong>
        </p>
      )}

      <div className="overflow-x-auto">
        <DataTable
          data={eventList}
          columns={columns}
          manualPagination
          pagination={queryParams.pagination}
          onPaginationChange={onPaginationChange}
          meta={{ onEditClick }}
        />
      </div>

      <EventPanel
        panelState={panelState}
        form={form}
        onSubmit={onCreateUpdate}
        setIsOpen={(isOpen) => setPanelState((prev) => ({ ...prev, isOpen }))}
      />
    </>
  );
};

export default EventListPage;

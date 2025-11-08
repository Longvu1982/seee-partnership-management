import { DataTable } from "@/components/data-table/DataTable";
import type { EnhancedColumnDef } from "@/components/data-table/dataTable.utils";
import { Button } from "@/components/ui/button";
import { useGetInitData } from "@/hooks/use-get-init-data";
import { usePagination } from "@/hooks/use-pagination";
import { apiListPartners } from "@/services/main/partnerServices";
import {
  initQueryParams,
  type PartnerFormValues,
  type PartnerResponse,
  type QueryDataModel,
} from "@/types/model/app-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PartnerPanel, { initFormValues, schema } from "./panel/PartnerPanel";

const columns: EnhancedColumnDef<PartnerResponse>[] = [
  {
    id: "STT",
    header: "STT",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Tên đối tác",
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
  },
  {
    accessorKey: "sector",
    header: "Lĩnh vực",
  },
  {
    accessorKey: "type",
    header: "Loại",
  },
  {
    accessorKey: "description",
    header: "Mô tả",
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

const PartnerListPage = () => {
  const [partnerList, setPartnerList] = useState<PartnerResponse[]>([]);
  const [queryParams, setQueryParams] =
    useState<QueryDataModel>(initQueryParams);
  const [panelState, setPanelState] = useState<{
    isOpen: boolean;
    type: "create" | "edit";
  }>({ isOpen: false, type: "create" });

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...initFormValues },
  });

  const getPartnerList = async (params: QueryDataModel) => {
    const { data } = await apiListPartners(params);
    if (data.success) {
      setPartnerList(data.data.partners ?? []);
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

  const onSubmit = (values: A) => {
    console.log(values);
  };

  const { onPaginationChange } = usePagination({
    queryParams,
    fetchData: getPartnerList,
  });

  useGetInitData(() => getPartnerList(initQueryParams));

  return (
    <>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
        Danh sách đối tác
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
        <PlusCircle /> Thêm kho
      </Button>

      <p className="mb-4">
        Số lượng: <strong>{queryParams.pagination.totalCount}</strong>
      </p>

      <div className="overflow-x-auto">
        <DataTable
          data={partnerList}
          columns={columns}
          manualPagination
          pagination={queryParams.pagination}
          onPaginationChange={onPaginationChange}
        />
      </div>

      <PartnerPanel
        form={form}
        panelState={panelState}
        setIsOpen={(value) =>
          setPanelState((prev) => ({ ...prev, isOpen: value }))
        }
        onSubmit={onSubmit}
      />
    </>
  );
};

export default PartnerListPage;

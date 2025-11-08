import { DataTable } from "@/components/data-table/DataTable";
import type { EnhancedColumnDef } from "@/components/data-table/dataTable.utils";
import { Button } from "@/components/ui/button";
import { useGetInitData } from "@/hooks/use-get-init-data";
import { usePagination } from "@/hooks/use-pagination";
import { apiListContacts } from "@/services/main/contactServices";
import {
  initQueryParams,
  type QueryDataModel,
  type ContactResponse,
} from "@/types/model/app-model";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";

const columns: EnhancedColumnDef<ContactResponse>[] = [
  {
    id: "STT",
    header: "STT",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Tên liên hệ",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "SĐT",
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

const ContactListPage = () => {
  const [contactList, setContactList] = useState<ContactResponse[]>([]);
  const [queryParams, setQueryParams] =
    useState<QueryDataModel>(initQueryParams);

  const getContactList = async (params: QueryDataModel) => {
    const { data } = await apiListContacts(params);
    if (data.success) {
      setContactList(data.data.contacts ?? []);
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
    fetchData: getContactList,
  });

  useGetInitData(() => getContactList(initQueryParams));

  return (
    <div className="overflow-x-auto">
      <DataTable
        data={contactList}
        columns={columns}
        manualPagination
        pagination={queryParams.pagination}
        onPaginationChange={onPaginationChange}
      />
    </div>
  );
};

export default ContactListPage;

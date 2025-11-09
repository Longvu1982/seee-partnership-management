import { DataTable } from "@/components/data-table/DataTable";
import type { EnhancedColumnDef } from "@/components/data-table/dataTable.utils";
import { Button } from "@/components/ui/button";
import { useGetInitData } from "@/hooks/use-get-init-data";
import { usePagination } from "@/hooks/use-pagination";
import { apiListUsers } from "@/services/main/userServices";
import {
  initQueryParams,
  type QueryDataModel,
  type UserResponse,
} from "@/types/model/app-model";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";

const columns: EnhancedColumnDef<UserResponse>[] = [
  {
    id: "STT",
    header: "STT",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Tên kho",
  },
  {
    accessorKey: "email",
    header: "Địa chỉ",
  },
  {
    accessorKey: "phone",
    header: "SĐT",
  },
  {
    accessorKey: "department",
    header: "Khoa",
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

const UserListPage = () => {
  const [userList, setUserList] = useState<UserResponse[]>([]);
  const [queryParams, setQueryParams] =
    useState<QueryDataModel>(initQueryParams);

  const getUserList = async (params: QueryDataModel) => {
    const { data } = await apiListUsers(params);
    if (data.success) {
      setUserList(data.data.users ?? []);
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
    fetchData: getUserList,
  });

  useGetInitData(() => getUserList(initQueryParams));

  return (
    <>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
        Danh sách tài khoản
      </h3>
      <div className="overflow-x-auto">
        <DataTable
          data={userList}
          columns={columns}
          manualPagination
          pagination={queryParams.pagination}
          onPaginationChange={onPaginationChange}
        />
      </div>
    </>
  );
};

export default UserListPage;

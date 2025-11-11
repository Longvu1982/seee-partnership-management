import { DataTable } from "@/components/data-table/DataTable";
import type { EnhancedColumnDef } from "@/components/data-table/dataTable.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGetInitData } from "@/hooks/use-get-init-data";
import { usePagination } from "@/hooks/use-pagination";
import { useTriggerLoading } from "@/hooks/use-trigger-loading";
import {
  apiCreateUser,
  apiListUsers,
  apiUpdateUser,
  apiUpdateUserStatus,
} from "@/services/main/userServices";
import useAuthStore from "@/store/auth";
import { useGlobalModal } from "@/store/global-modal";
import { Department, Role } from "@/types/enum/app-enum";
import {
  initQueryParams,
  type QueryDataModel,
  type UserFormValues,
  type UserResponse,
} from "@/types/model/app-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import UserPanel, { initFormValues, schema } from "./panel/UserPanel";

const getDepartmentLabel = (dept: Department) => {
  const labels = {
    [Department.ELECTRICAL]: "Điện",
    [Department.ELECTRONIC]: "Điện tử",
    [Department.COMMUNICATION]: "KT truyền thông",
    [Department.AUTOMATION]: "Tự động hóa",
    [Department.SCHOOLOFFICE]: "Văn phòng trường",
  };
  return labels[dept] || dept;
};

const getRoleLabel = (role: Role) => {
  return role === Role.ADMIN ? "Quản trị viên" : "Người dùng";
};

const columns: EnhancedColumnDef<UserResponse>[] = [
  {
    id: "STT",
    header: "STT",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
  },
  {
    header: "Trạng thái",
    accessorKey: "isActive",
    cell: ({ getValue, table, row }) => {
      const onActiveStateChange = table.options.meta?.onActiveStateChange;
      const currentUserId = table.options.meta?.currentUserId;
      const isActive = getValue() as boolean;
      const isCurrentUser = row.original.id === currentUserId;

      return (
        <div className="flex items-center gap-2">
          <Switch
            id={row.original.id}
            checked={isActive}
            disabled={isCurrentUser}
            onCheckedChange={(value) =>
              onActiveStateChange?.(row.original, value)
            }
          />
          <Label htmlFor={row.original.id} className="font-medium w-[75px]">
            {isActive ? "Hoạt động" : "Tạm ngưng"}
          </Label>
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Tên đăng nhập",
    cell: ({ getValue, table, row }) => {
      const currentUserId = table.options.meta?.currentUserId;
      const isCurrentUser = row.original.id === currentUserId;
      const username = getValue() as string;

      return (
        <div className="flex items-center gap-2">
          <span>{username}</span>
          {isCurrentUser && (
            <Badge variant="outline" className="text-xs">
              Hiện tại
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ getValue }) => {
      const name = getValue() as string;
      return <span className="whitespace-nowrap">{name}</span>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => {
      const email = getValue() as string | null;
      return <span>{email || "-"}</span>;
    },
  },
  {
    accessorKey: "phone",
    header: "SĐT",
    cell: ({ getValue }) => {
      const phone = getValue() as string | null;
      return <span className="whitespace-nowrap">{phone || "-"}</span>;
    },
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ getValue }) => {
      const role = getValue() as Role;
      return <span className="whitespace-nowrap">{getRoleLabel(role)}</span>;
    },
  },
  {
    accessorKey: "department",
    header: "Khoa",
    cell: ({ getValue }) => {
      const dept = getValue() as Department;
      return (
        <span className="whitespace-nowrap">{getDepartmentLabel(dept)}</span>
      );
    },
  },
  {
    id: "actions",
    fixed: true,
    size: 120,
    enableResizing: false,
    cell: ({ row, table }) => {
      const onEditClick = table.options.meta?.onEditClick;
      const currentUserId = table.options.meta?.currentUserId;
      const isCurrentUser = row.original.id === currentUserId;

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEditClick?.(row.original)}
            disabled={isCurrentUser}
          >
            <Edit />
          </Button>
          <Button variant="outline" size="icon" disabled={isCurrentUser}>
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
  const [panelState, setPanelState] = useState<{
    isOpen: boolean;
    type: "create" | "edit";
  }>({ isOpen: false, type: "create" });

  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === Role.ADMIN;
  const { triggerLoading } = useTriggerLoading();
  const { openConfirmModal } = useGlobalModal();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...initFormValues },
  });

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

  const onCreateUpdate = async (data: UserFormValues) => {
    await triggerLoading(async () => {
      const promise =
        panelState.type === "create" ? apiCreateUser : apiUpdateUser;

      await promise(data);

      toast.success(
        panelState.type === "create"
          ? "Tạo tài khoản thành công"
          : "Chỉnh sửa thành công"
      );

      await getUserList(queryParams);
      setPanelState((prev) => ({ ...prev, isOpen: false }));
    });
  };

  const onEditClick = (data: UserResponse) => {
    form.reset({
      ...data,
      password: "",
    });
    setPanelState((prev) => ({ ...prev, isOpen: true, type: "edit" }));
  };

  const onActiveStateChange = async (row: UserResponse, isActive: boolean) => {
    const action = isActive ? "kích hoạt" : "tạm ngưng";
    const actionTitle = isActive
      ? "Kích hoạt tài khoản"
      : "Tạm ngưng tài khoản";

    openConfirmModal({
      title: actionTitle,
      content: `Bạn có chắc chắn muốn ${action} tài khoản "${row.name}" (${row.username})?`,
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      confirmType: isActive ? "normal" : "warning",
      onConfirm: async (closeModal) => {
        await triggerLoading(async () => {
          const { data } = await apiUpdateUserStatus(row.id, isActive);
          if (data.success) {
            toast.success("Thay đổi trạng thái thành công");
            await getUserList(queryParams);
            closeModal();
          }
        });
      },
    });
  };

  const { onPaginationChange } = usePagination({
    queryParams,
    fetchData: getUserList,
  });

  useGetInitData(() => getUserList(initQueryParams));

  return (
    <>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
        Quản lý người dùng
      </h3>

      {isAdmin && (
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
          <PlusCircle /> Tạo tài khoản
        </Button>
      )}

      {queryParams.pagination.totalCount > 0 && (
        <p className="">
          Số lượng: <strong>{queryParams.pagination.totalCount}</strong>
        </p>
      )}

      <div className="overflow-x-auto">
        <DataTable
          data={userList}
          columns={columns}
          manualPagination
          pagination={queryParams.pagination}
          onPaginationChange={onPaginationChange}
          meta={{
            onEditClick,
            onActiveStateChange,
            currentUserId: user?.id,
          }}
        />
      </div>

      <UserPanel
        form={form}
        panelState={panelState}
        setIsOpen={(value) =>
          setPanelState((prev) => ({ ...prev, isOpen: value }))
        }
        onSubmit={onCreateUpdate}
      />
    </>
  );
};

export default UserListPage;

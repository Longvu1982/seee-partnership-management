import { DataTable } from "@/components/data-table/DataTable";
import type { EnhancedColumnDef } from "@/components/data-table/dataTable.utils";
import { Button } from "@/components/ui/button";
import { useGetInitData } from "@/hooks/use-get-init-data";
import { usePagination } from "@/hooks/use-pagination";
import { useTriggerLoading } from "@/hooks/use-trigger-loading";
import {
  apiCreateContact,
  apiListContacts,
  apiUpdateContact,
} from "@/services/main/contactServices";
import {
  initQueryParams,
  type ContactFormValues,
  type ContactResponse,
  type QueryDataModel,
} from "@/types/model/app-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ContactPanel, {
  initFormValues as contactInitFormValues,
  schema as contactSchema,
  initFormValues,
} from "./panel/ContactPanel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const columns: EnhancedColumnDef<ContactResponse>[] = [
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
      const isActive = getValue() as boolean;

      return (
        <div className="flex items-center gap-2">
          <Switch
            id={row.original.id}
            checked={isActive}
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
    cell: ({ getValue }) => (
      <span className="whitespace-pre-line block min-w-[100px]">
        {getValue() as string}
      </span>
    ),
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
  const [panelState, setPanelState] = useState<{
    isOpen: boolean;
    type: "create" | "edit";
  }>({ isOpen: false, type: "create" });

  const { triggerLoading } = useTriggerLoading();

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { ...contactInitFormValues },
  });

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

  const onCreateUpdateContact = async (data: ContactFormValues) => {
    const method =
      panelState.type === "create" ? apiCreateContact : apiUpdateContact;

    await triggerLoading(async () => {
      const resp = await method(data);
      if (resp.data?.success) {
        toast.success(
          panelState.type === "create"
            ? "Thêm liên hệ thành công"
            : "Cập nhật liên hệ thành công"
        );
        setPanelState((prev) => ({ ...prev, isOpen: false }));
        await getContactList(queryParams);
      }
    });
  };

  const onEditClick = (row: ContactResponse) => {
    form.reset({ ...row });
    setPanelState({ isOpen: true, type: "edit" });
  };

  const onActiveStateChange = async (
    row: ContactResponse,
    isActive: boolean
  ) => {
    await triggerLoading(async () => {
      const { data } = await apiUpdateContact({ ...row, isActive });
      if (data.success) toast.success("Thay đổi trạng thái thành công");
      await getContactList(queryParams);
    });
  };

  const { onPaginationChange } = usePagination({
    queryParams,
    fetchData: getContactList,
  });

  useGetInitData(() => getContactList(initQueryParams));

  return (
    <>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
        Danh sách liên hệ
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
        <PlusCircle /> Thêm liên hệ
      </Button>

      <p className="">
        Số lượng: <strong>{queryParams.pagination.totalCount}</strong>
      </p>

      <div className="overflow-x-auto">
        <DataTable
          data={contactList}
          columns={columns}
          manualPagination
          pagination={queryParams.pagination}
          onPaginationChange={onPaginationChange}
          meta={{ onEditClick, onActiveStateChange }}
        />
      </div>
      <ContactPanel
        form={form}
        panelState={panelState}
        setIsOpen={(isOpen) => setPanelState((prev) => ({ ...prev, isOpen }))}
        onSubmit={onCreateUpdateContact}
      />
    </>
  );
};

export default ContactListPage;

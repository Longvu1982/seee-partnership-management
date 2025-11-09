import { DataTable } from "@/components/data-table/DataTable";
import type { EnhancedColumnDef } from "@/components/data-table/dataTable.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useGetInitData } from "@/hooks/use-get-init-data";
import { usePagination } from "@/hooks/use-pagination";
import { useTriggerLoading } from "@/hooks/use-trigger-loading";
import {
  apiCreatePartner,
  apiListPartners,
  apiUpdatePartner,
  apiUpdatePartnerStatus,
} from "@/services/main/partnerServices";
import { useGlobalModal } from "@/store/global-modal";
import {
  initQueryParams,
  type PartnerFormValues,
  type PartnerResponse,
  type QueryDataModel,
} from "@/types/model/app-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Mail, Phone, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
    cell: ({ getValue }) => (
      <span className="whitespace-pre-line block min-w-[100px]">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "partnerContacts",
    header: "Liên Hệ",
    cell: ({ row, table }) => {
      const contacts = (row.original.partnerContacts ?? []).map(
        (p) => p.contact
      );

      const onViewContactlist = table.options.meta?.onViewContactlist;

      if (!contacts.length) return <></>;

      return (
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-75"
          onClick={() => onViewContactlist?.(row.original)}
        >
          <span>{contacts[0].name}</span>
          {contacts.length > 1 && (
            <Badge className="rounded-full bg-gray-600 text-white flex items-center justify-between min-w-[26px] p-1">
              <span>+{contacts.length - 1}</span>
            </Badge>
          )}
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

const PartnerListPage = () => {
  const [partnerList, setPartnerList] = useState<PartnerResponse[]>([]);
  const [queryParams, setQueryParams] =
    useState<QueryDataModel>(initQueryParams);
  const [panelState, setPanelState] = useState<{
    isOpen: boolean;
    type: "create" | "edit";
  }>({ isOpen: false, type: "create" });

  const { triggerLoading } = useTriggerLoading();
  const { openLeave } = useGlobalModal();

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

  const onCreateUpdate = async (data: PartnerFormValues) => {
    await triggerLoading(async () => {
      const promise =
        panelState.type === "create" ? apiCreatePartner : apiUpdatePartner;

      await promise(data);

      toast.success(
        panelState.type === "create"
          ? "Thêm đối tác mới thành công"
          : "Chỉnh sửa thành công"
      );

      await getPartnerList(queryParams);
      setPanelState((prev) => ({ ...prev, isOpen: false }));
    });
  };

  const onEditClick = (data: PartnerResponse) => {
    form.reset({
      ...data,
      contactIds: data.partnerContacts
        ? data.partnerContacts.map((item) => item.contact.id)
        : [],
    });
    setPanelState((prev) => ({ ...prev, isOpen: true, type: "edit" }));
  };

  const onViewContactlist = (row: PartnerResponse) => {
    const contacts = (row.partnerContacts ?? []).map((pc) => pc.contact);

    openLeave({
      title: `Danh sách liên hệ - ${row.name}`,
      content: (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto py-1">
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Không có liên hệ nào
            </p>
          ) : (
            contacts.map((contact) => (
              <Card key={contact.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-1">
                          {contact.name}
                        </h3>
                        <Badge
                          variant={contact.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {contact.isActive ? "Hoạt động" : "Tạm ngưng"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {(contact.email || contact.phone) && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Email:
                            </span>
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-primary hover:underline"
                            >
                              {contact.email}
                            </a>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Điện thoại:
                            </span>
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-primary hover:underline"
                            >
                              {contact.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {contact.description && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                          Mô tả
                        </p>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {contact.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      ),
    });
  };

  const onActiveStateChange = async (
    row: PartnerResponse,
    isActive: boolean
  ) => {
    await triggerLoading(async () => {
      const { data } = await apiUpdatePartnerStatus(row.id, isActive);
      if (data.success) toast.success("Thay đổi trạng thái thành công");
      await getPartnerList(queryParams);
    });
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
        <PlusCircle /> Thêm đối tác
      </Button>

      <p className="">
        Số lượng: <strong>{queryParams.pagination.totalCount}</strong>
      </p>

      <div className="overflow-x-auto">
        <DataTable
          data={partnerList}
          columns={columns}
          manualPagination
          pagination={queryParams.pagination}
          onPaginationChange={onPaginationChange}
          meta={{ onEditClick, onActiveStateChange, onViewContactlist }}
        />
      </div>

      <PartnerPanel
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

export default PartnerListPage;

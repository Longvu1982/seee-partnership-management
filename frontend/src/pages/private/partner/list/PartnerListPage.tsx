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
  apiCreatePartner,
  apiDeletePartner,
  apiListPartners,
  apiUpdatePartner,
  apiUpdatePartnerStatus,
} from "@/services/main/partnerServices";
import {
  PartnerRank,
  PartnerSector,
  PartnerType,
  Role,
} from "@/types/enum/app-enum";
import useAuthStore from "@/store/auth";
import { useGlobalModal } from "@/store/global-modal";
import {
  initQueryParams,
  type PartnerFormValues,
  type PartnerResponse,
  type QueryDataModel,
} from "@/types/model/app-model";
import { useContactListModal } from "@/utils/contact-list-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import PartnerPanel, { initFormValues, schema } from "./panel/PartnerPanel";
import PartnerViewPanel from "./panel/PartnerViewPanel";
import {
  getPartnerRankIcon,
  getPartnerRankLabel,
  getPartnerSectorLabel,
  getPartnerTypeLabel,
} from "./partner.utils";

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
    cell: ({ getValue, table, row }) => {
      return (
        <span
          className="hover:underline text-primary font-semibold min-w-[100px] block line-clamp-2 cursor-pointer"
          onClick={() => table.options.meta?.onViewPanel?.(row.original)}
        >
          {getValue() as string}
        </span>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
  },
  {
    accessorKey: "sector",
    header: "Lĩnh vực",
    size: 200,
    cell: ({ getValue, row }) => {
      const sectors = (getValue() as PartnerSector[]) ?? [];
      return (
        <span>
          {sectors
            .map((s) => {
              if (s === PartnerSector.OTHERS)
                return row.original.otherSectorName;
              return getPartnerSectorLabel(s);
            })
            .join(", ")}
        </span>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ getValue, row }) => {
      const type = getValue() as PartnerType;
      if (type === PartnerType.OTHER) return row.original.otherTypeName;
      return (
        <span className="whitespace-nowrap">
          {type ? getPartnerTypeLabel(type) : ""}
        </span>
      );
    },
  },
  {
    accessorKey: "rank",
    header: "Hạng",
    cell: ({ getValue, row }) => {
      const rank = getValue() as PartnerRank;

      return (
        <span className="flex items-center whitespace-nowrap">
          {rank ? getPartnerRankIcon(rank) : null}
          {rank === PartnerRank.OTHER
            ? row.original.otherRank
            : getPartnerRankLabel(rank)}
        </span>
      );
    },
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
    size: 200,
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
      const { isAdmin, onEditClick, onDeleteClick } = table.options.meta ?? {};

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEditClick?.(row.original)}
            className=""
          >
            <Edit />
          </Button>
          {isAdmin && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDeleteClick?.(row.original)}
              className="hover:bg-red-600! text-red-500 hover:text-white!"
            >
              <Trash />
            </Button>
          )}
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
  const [viewPanelData, setViewPanelData] = useState<PartnerResponse | null>(
    null
  );

  const { triggerLoading } = useTriggerLoading();
  const { openContactListModal } = useContactListModal();
  const { openConfirmModal } = useGlobalModal();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === Role.ADMIN;

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
    openContactListModal(row);
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

  const handleOpenViewPanel = (partner: PartnerResponse) => {
    setViewPanelData(partner);
  };

  const onDeleteClick = (partner: PartnerResponse) => {
    console.log("here");
    openConfirmModal({
      title: "Xác nhận xóa đối tác",
      content: `Bạn có chắc chắn muốn xóa đối tác "${partner.name}"? Hành động này không thể hoàn tác.`,
      confirmText: "Xóa",
      cancelText: "Hủy",
      confirmType: "alert",
      onConfirm: async (closeModal) => {
        await triggerLoading(async () => {
          const { data } = await apiDeletePartner(partner.id);
          if (data.success) {
            toast.success("Xóa đối tác thành công");
            await getPartnerList(queryParams);
            closeModal();
          }
        });
      },
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

      {queryParams.pagination.totalCount > 0 && (
        <p className="">
          Số lượng: <strong>{queryParams.pagination.totalCount}</strong>
        </p>
      )}

      <div className="overflow-x-auto">
        <DataTable
          data={partnerList}
          columns={columns}
          manualPagination
          pagination={queryParams.pagination}
          onPaginationChange={onPaginationChange}
          meta={{
            onEditClick,
            onActiveStateChange,
            onViewContactlist,
            onViewPanel: handleOpenViewPanel,
            onDeleteClick,
            isAdmin,
          }}
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

      <PartnerViewPanel
        partner={viewPanelData}
        open={!!viewPanelData}
        onClose={() => setViewPanelData(null)}
      />
    </>
  );
};

export default PartnerListPage;

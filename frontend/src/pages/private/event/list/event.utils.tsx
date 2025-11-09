import { EventStatus } from "@/types/enum/app-enum";
import { apiListContacts } from "@/services/main/contactServices";
import { apiListPartners } from "@/services/main/partnerServices";
import { initQueryParams } from "@/types/model/app-model";
import { useEffect, useState } from "react";

// Helper function to get badge variant and text for event status
export const getEventStatusBadge = (status: EventStatus) => {
  const statusConfig = {
    [EventStatus.PROSPECT]: {
      variant: "outline" as const,
      text: "Đang triển khai",
    },
    [EventStatus.PENDING]: { variant: "secondary" as const, text: "Chờ duyệt" },
    [EventStatus.ACTIVE]: {
      variant: "default" as const,
      text: "Đang hoạt động",
    },
    [EventStatus.CLOSED]: {
      variant: "half_destructive" as const,
      text: "Đã đóng",
    },
    [EventStatus.TERMINATED]: {
      variant: "destructive" as const,
      text: "Đã hủy",
    },
  };

  return statusConfig[status] || { variant: "outline" as const, text: status };
};

export const eventStatusOptions = Object.values(EventStatus).map((status) => ({
  value: status,
  label: "",
}));

export const useGetPartnerAndContactOptions = () => {
  const [partnerOptions, setPartnerOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [contactOptions, setContactOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  useEffect(() => {
    (async () => {
      const [partnerRes, contactRes] = await Promise.all([
        apiListPartners({
          ...initQueryParams,
          pagination: { ...initQueryParams.pagination, pageSize: 1000 },
        }),
        apiListContacts({
          ...initQueryParams,
          pagination: { ...initQueryParams.pagination, pageSize: 1000 },
        }),
      ]);

      setPartnerOptions(
        partnerRes.data.data.partners.map((p) => ({
          label: p.name,
          value: p.id,
        })) ?? []
      );
      setContactOptions(
        contactRes.data.data.contacts.map((c) => ({
          label: c.name,
          value: c.id,
        })) ?? []
      );
    })();
  }, []);

  return { partnerOptions, contactOptions };
};

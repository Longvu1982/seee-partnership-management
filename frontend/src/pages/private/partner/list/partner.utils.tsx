import { apiListContacts } from "@/services/main/contactServices";
import { PartnerRank, PartnerSector, PartnerType } from "@/types/enum/app-enum";
import { initQueryParams } from "@/types/model/app-model";
import { Gem, HelpCircle, Medal, MinusCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const useGetOptions = () => {
  const [contactOptions, setContactOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  useEffect(() => {
    (async () => {
      const [contactRes] = await Promise.all([
        apiListContacts({
          ...initQueryParams,
          pagination: { ...initQueryParams.pagination, pageSize: 1000 },
        }),
      ]);

      setContactOptions(
        contactRes.data.data.contacts.map((c) => ({
          label: c.name,
          value: c.id,
        })) ?? []
      );
    })();
  }, []);

  return { contactOptions };
};

// _____________  Partner label mappers  _____________
export const getPartnerTypeLabel = (t: PartnerType) =>
  ((
    {
      [PartnerType.INDIVIDUAL]: "Cá nhân",
      [PartnerType.ORGANIZATION]: "Tổ chức",
      [PartnerType.OTHER]: "Khác",
    } as const
  )[t] ?? t);

export const getPartnerSectorLabel = (s: PartnerSector) =>
  ((
    {
      [PartnerSector.ACADEMIC]: "Học thuật",
      [PartnerSector.INDUSTRY]: "Công nghiệp",
      [PartnerSector.NGO]: "Phi chính phủ",
      [PartnerSector.GOVERNMENT]: "Chính phủ",
      [PartnerSector.OTHERS]: "Khác",
    } as const
  )[s] ?? s);

export const getPartnerRankLabel = (r: PartnerRank) =>
  ((
    {
      [PartnerRank.DIAMOND]: "Kim cương",
      [PartnerRank.GOLD]: "Vàng",
      [PartnerRank.SILVER]: "Bạc",
      [PartnerRank.NOTYET]: "Chưa xếp hạng",
      [PartnerRank.OTHER]: "Khác",
    } as const
  )[r] ?? r);

export const getPartnerRankIcon = (rank: PartnerRank, size = 16) => {
  switch (rank) {
    case PartnerRank.DIAMOND:
      return (
        <Gem
          size={size}
          color="#38bdf8"
          className="inline mr-1 align-text-bottom"
        />
      );
    case PartnerRank.GOLD:
      return (
        <Medal
          size={size}
          color="#eab308"
          className="inline mr-1 align-text-bottom"
        />
      );
    case PartnerRank.SILVER:
      return (
        <Medal
          size={size}
          color="#a3a3a3"
          className="inline mr-1 align-text-bottom"
        />
      );
    case PartnerRank.NOTYET:
      return (
        <MinusCircle
          size={size}
          color="#a3a3a3"
          className="inline mr-1 align-text-bottom"
        />
      );
    case PartnerRank.OTHER:
      return (
        <HelpCircle
          size={size}
          className="inline mr-1 align-text-bottom text-#a3a3a3 dark:text-#d4d4d8 "
        />
      );
    default:
      return null;
  }
};

export const partnerTypeOptions = Object.values(PartnerType).map((v) => ({
  value: v,
  label: getPartnerTypeLabel(v),
}));

export const partnerSectorOptions = Object.values(PartnerSector).map((v) => ({
  value: v,
  label: getPartnerSectorLabel(v),
}));

export const partnerRankOptions = Object.values(PartnerRank).map((v) => ({
  value: v,
  label: getPartnerRankLabel(v),
}));

import Panel from "@/components/panel/Panel";
import { Badge } from "@/components/ui/badge";
import { ContactCard } from "@/components/contact-card/ContactCard";
import {
  getPartnerRankIcon,
  getPartnerRankLabel,
  getPartnerSectorLabel,
  getPartnerTypeLabel,
} from "../partner.utils";
import type { FC } from "react";
import type { PartnerResponse } from "@/types/model/app-model";
import { PartnerRank, PartnerSector, PartnerType } from "@/types/enum/app-enum";
import { Button } from "@/components/ui/button";

interface PartnerViewPanelProps {
  partner: PartnerResponse | null;
  open: boolean;
  onClose: () => void;
}

const PartnerViewPanel: FC<PartnerViewPanelProps> = ({
  partner,
  open,
  onClose,
}) => {
  if (!partner) return null;

  const sectors = (partner.sector ?? []).map((s) =>
    s === PartnerSector.OTHERS
      ? partner.otherSectorName
      : getPartnerSectorLabel(s)
  );

  const type =
    partner.type === PartnerType.OTHER
      ? partner.otherTypeName
      : partner.type
      ? getPartnerTypeLabel(partner.type)
      : "";

  const rankVal = partner.rank;

  const rank =
    rankVal === PartnerRank.OTHER
      ? partner.otherRank
      : rankVal
      ? getPartnerRankLabel(rankVal)
      : "";

  return (
    <Panel
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title="Chi tiết đối tác"
      description="Xem thông tin đối tác"
      footer={
        <Button variant="outline" onClick={() => onClose()}>
          Quay lại
        </Button>
      }
    >
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="pb-4 border-b space-y-3">
          <h2 className="text-2xl font-semibold">{partner.name}</h2>
          <div className="flex flex-col gap-3">
            <div>
              <Badge
                variant={partner.isActive ? "default" : "secondary"}
                className="text-xs"
              >
                {partner.isActive ? "Hoạt động" : "Tạm ngưng"}
              </Badge>
            </div>
            {partner.tags && partner.tags.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {partner.tags.map((tag, i) => (
                  <span key={i} className="text-sm text-primary font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-4">
          {type && (
            <div className="grid grid-cols-3 gap-2">
              <div className="text-sm text-muted-foreground">Loại đối tác</div>
              <div className="col-span-2 text-sm font-medium">{type}</div>
            </div>
          )}

          {rank && (
            <div className="grid grid-cols-3 gap-2">
              <div className="text-sm text-muted-foreground">Xếp hạng</div>
              <div className="col-span-2 flex items-center text-sm font-medium">
                {getPartnerRankIcon(rankVal as PartnerRank, 16)}
                {rank}
              </div>
            </div>
          )}

          {sectors && sectors.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              <div className="text-sm text-muted-foreground">Lĩnh vực</div>
              <div className="col-span-2 text-sm font-medium">
                {sectors.join(", ")}
              </div>
            </div>
          )}

          {partner.address && (
            <div className="grid grid-cols-3 gap-2">
              <div className="text-sm text-muted-foreground">Địa chỉ</div>
              <div className="col-span-2 text-sm font-medium">
                {partner.address}
              </div>
            </div>
          )}
        </div>

        {/* Description Section */}
        {partner.description && (
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Mô tả
            </div>
            <div className="text-sm whitespace-pre-line">
              {partner.description}
            </div>
          </div>
        )}

        {/* Contacts Section */}
        {!!(partner.partnerContacts && partner.partnerContacts.length) && (
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground mb-3">
              Danh sách liên hệ
            </div>
            <div className="space-y-3">
              {partner.partnerContacts.map((c) => (
                <ContactCard key={c.id} contact={c.contact} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
};

export default PartnerViewPanel;

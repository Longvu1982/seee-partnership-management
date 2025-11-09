import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone } from "lucide-react";
import type { PartnerResponse } from "@/types/model/app-model";
import { useGlobalModal } from "@/store/global-modal";

export const useContactListModal = () => {
  const { openLeave } = useGlobalModal();

  const openContactListModal = useCallback(
    (partner: PartnerResponse) => {
      const contacts = (partner.partnerContacts ?? []).map((pc) => pc.contact);

      openLeave({
        title: `Danh sách liên hệ - ${partner.name}`,
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
    },
    [openLeave]
  );

  return { openContactListModal };
};

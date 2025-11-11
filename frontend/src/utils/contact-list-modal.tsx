import { ContactCard } from "@/components/contact-card/ContactCard";
import { useGlobalModal } from "@/store/global-modal";
import type { PartnerResponse } from "@/types/model/app-model";
import { useCallback } from "react";

export const useContactListModal = () => {
  const { openLeave } = useGlobalModal();

  const openContactListModal = useCallback(
    (partner: PartnerResponse) => {
      const contacts = (partner.partnerContacts ?? []).map((pc) => pc.contact);

      openLeave({
        title: `Danh sách liên hệ - ${partner.name}`,
        content: (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto py-1 theme-scrollbar">
            {contacts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Không có liên hệ nào
              </p>
            ) : (
              contacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
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

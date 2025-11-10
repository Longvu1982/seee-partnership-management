import { useGlobalModal } from "@/store/global-modal";
import { useCallback } from "react";
import { DocumentsTable } from "@/components/documents-table/DocumentsTable";

export const useDocumentsModal = () => {
  const { openLeave } = useGlobalModal();

  const openDocumentsModal = useCallback(
    (title: string, documents: string[]) => {
      openLeave({
        title: `Danh sách tài liệu - ${title}`,
        content: (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto py-1 theme-scrollbar">
            <DocumentsTable documents={documents} />
          </div>
        ),
      });
    },
    [openLeave]
  );

  return { openDocumentsModal };
};

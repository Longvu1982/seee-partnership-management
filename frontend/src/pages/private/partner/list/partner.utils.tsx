import { apiListContacts } from "@/services/main/contactServices";
import { initQueryParams } from "@/types/model/app-model";
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

import { useTriggerLoading } from "./use-trigger-loading";
import type { QueryDataModel } from "@/types/model/app-model";

type PaginationChangeParams = {
  pageIndex: number;
  pageSize: number;
};

type UsePaginationOptions<T> = {
  queryParams: QueryDataModel;
  fetchData: (params: QueryDataModel) => Promise<T>;
};

export const usePagination = <T>({
  queryParams,
  fetchData,
}: UsePaginationOptions<T>) => {
  const { triggerLoading } = useTriggerLoading();

  const onPaginationChange = async ({
    pageIndex,
    pageSize,
  }: PaginationChangeParams) => {
    const newData = {
      ...queryParams,
      pagination: {
        ...queryParams.pagination,
        pageIndex,
        pageSize,
      },
    };
    triggerLoading(async () => {
      await fetchData(newData);
    });
  };

  return { onPaginationChange };
};

import ApiService from "../APIService";
import type {
  QueryDataModel,
  EventListResponse,
} from "@/types/model/app-model";
import type { AxiosResponse } from "axios";

export async function apiListEvents(
  query: QueryDataModel
): Promise<AxiosResponse<EventListResponse>> {
  return ApiService.fetchData<EventListResponse>({
    url: "/event/list",
    method: "post",
    data: query,
  });
}

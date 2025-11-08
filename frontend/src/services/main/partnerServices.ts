import ApiService from "../APIService";
import type {
  QueryDataModel,
  PartnerListResponse,
} from "@/types/model/app-model";
import type { AxiosResponse } from "axios";

export async function apiListPartners(
  query: QueryDataModel
): Promise<AxiosResponse<PartnerListResponse>> {
  return ApiService.fetchData<PartnerListResponse>({
    url: "/partner/list",
    method: "post",
    data: query,
  });
}

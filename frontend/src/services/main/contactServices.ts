import ApiService from "../APIService";
import type {
  QueryDataModel,
  ContactListResponse,
} from "@/types/model/app-model";
import type { AxiosResponse } from "axios";

export async function apiListContacts(
  query: QueryDataModel
): Promise<AxiosResponse<ContactListResponse>> {
  return ApiService.fetchData<ContactListResponse>({
    url: "/contact/list",
    method: "post",
    data: query,
  });
}

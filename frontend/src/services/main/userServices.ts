import ApiService from "../APIService";
import type { QueryDataModel, UserListResponse } from "@/types/model/app-model";
import type { AxiosResponse } from "axios";

export async function apiListUsers(
  query: QueryDataModel
): Promise<AxiosResponse<UserListResponse>> {
  return ApiService.fetchData<UserListResponse>({
    url: "/user/list",
    method: "post",
    data: query,
  });
}

import ApiService from "../APIService";
import type {
  QueryDataModel,
  UserListResponse,
  UserFormValues,
  UserResponse,
  ApiResponse,
} from "@/types/model/app-model";
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

export async function apiCreateUser(
  data: UserFormValues
): Promise<AxiosResponse<ApiResponse<UserResponse>>> {
  return ApiService.fetchData<ApiResponse<UserResponse>>({
    url: "/user",
    method: "post",
    data,
  });
}

export async function apiUpdateUser(
  data: UserFormValues
): Promise<AxiosResponse<ApiResponse<UserResponse>>> {
  const { id, ...updateData } = data;
  return ApiService.fetchData<ApiResponse<UserResponse>>({
    url: `/user/${id}`,
    method: "put",
    data: updateData,
  });
}

export async function apiUpdateUserStatus(
  id: string,
  isActive: boolean
): Promise<AxiosResponse<ApiResponse<UserResponse>>> {
  return ApiService.fetchData<ApiResponse<UserResponse>>({
    url: `/user/${id}/status`,
    method: "patch",
    data: { isActive },
  });
}

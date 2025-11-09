import ApiService from "../APIService";
import type {
  QueryDataModel,
  ContactListResponse,
  ContactFormValues,
  ContactCreateResponse,
  ContactUpdateResponse,
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

export async function apiCreateContact(
  data: ContactFormValues
): Promise<AxiosResponse<ContactCreateResponse>> {
  return ApiService.fetchData<ContactCreateResponse>({
    url: "/contact",
    method: "post",
    data,
  });
}

export async function apiUpdateContact(
  data: ContactFormValues
): Promise<AxiosResponse<ContactUpdateResponse>> {
  const { id, ...updateData } = data;
  return ApiService.fetchData<ContactUpdateResponse>({
    url: `/contact/${id}`,
    method: "put",
    data: updateData,
  });
}

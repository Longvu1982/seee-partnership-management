import ApiService from "../APIService";
import type {
  QueryDataModel,
  PartnerListResponse,
  PartnerFormValues,
  PartnerCreateResponse,
  PartnerUpdateResponse,
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

export async function apiCreatePartner(
  data: PartnerFormValues
): Promise<AxiosResponse<PartnerCreateResponse>> {
  return ApiService.fetchData<PartnerCreateResponse>({
    url: "/partner",
    method: "post",
    data,
  });
}

export async function apiUpdatePartner(
  data: PartnerFormValues
): Promise<AxiosResponse<PartnerUpdateResponse>> {
  const { id, ...updateData } = data;
  return ApiService.fetchData<PartnerUpdateResponse>({
    url: `/partner/${id}`,
    method: "put",
    data: updateData,
  });
}

export async function apiUpdatePartnerStatus(
  id: string,
  isActive: boolean
): Promise<AxiosResponse<PartnerUpdateResponse>> {
  return ApiService.fetchData<PartnerUpdateResponse>({
    url: `/partner/${id}/status`,
    method: "patch",
    data: { isActive },
  });
}

export async function apiDeletePartner(
  id: string
): Promise<AxiosResponse<PartnerUpdateResponse>> {
  return ApiService.fetchData<PartnerUpdateResponse>({
    url: `/partner/${id}`,
    method: "delete",
  });
}

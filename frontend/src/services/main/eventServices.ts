import ApiService from "../APIService";
import type {
  QueryDataModel,
  EventListResponse,
  EventFormValues,
  EventCreateResponse,
  EventUpdateResponse,
  EventResponse,
  ApiResponse,
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

export async function apiCreateEvent(
  data: EventFormValues
): Promise<AxiosResponse<EventCreateResponse>> {
  return ApiService.fetchData<EventCreateResponse>({
    url: "/event",
    method: "post",
    data,
  });
}

export async function apiGetEventById(
  id: string
): Promise<AxiosResponse<ApiResponse<EventResponse>>> {
  return ApiService.fetchData<ApiResponse<EventResponse>>({
    url: `/event/${id}`,
    method: "get",
  });
}

export async function apiUpdateEvent(
  data: EventFormValues
): Promise<AxiosResponse<EventUpdateResponse>> {
  const { id, ...updateData } = data;
  return ApiService.fetchData<EventUpdateResponse>({
    url: `/event/${id}`,
    method: "put",
    data: updateData,
  });
}

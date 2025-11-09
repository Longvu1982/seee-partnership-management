import type { EventStatus, Role } from "../enum/app-enum";

export type QueryDataModel = {
  pagination: {
    pageSize: number;
    pageIndex: number;
    totalCount: number;
  };
  searchText?: string;
  sort?: { column: string; type: "asc" | "desc" };
  filter?: [{ column: string; value: A | A[] }];
};

export const initQueryParams: QueryDataModel = {
  searchText: "",
  pagination: {
    pageSize: 20,
    pageIndex: 0,
    totalCount: 0,
  },
  filter: [] as unknown as [{ column: string; value: A | A[] }],
  sort: {} as unknown as { column: string; type: "asc" | "desc" },
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  username: string;
};

export type ContactResponse = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PartnerResponse = {
  id: string;
  name: string;
  description: string | null;
  sector: string | null;
  address: string | null;
  type: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  partnerContacts?: {
    id: string;
    contact: ContactResponse;
  }[];
};

export type EventResponse = {
  id: string;
  title: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: EventStatus;
  documents: string[];
  funding_amount: number | null;
  funding_currency: string | null;
  student_reach_planned: number | null;
  student_reach_actual: number | null;
  feedback: string | null;
  rating: number | null;
  userId: string;
  eventContacts?: {
    id: string;
    contact: ContactResponse;
  }[];
  partnerEvents?: {
    id: string;
    partner: PartnerResponse;
  }[];
  user?: UserResponse;
  createdAt: string;
  updatedAt: string;
};

export type ApiListResponse<T> = {
  success: boolean;
  data: {
    totalCount: number;
  } & T;
};

export type UserListResponse = ApiListResponse<{ users: UserResponse[] }>;
export type ContactListResponse = ApiListResponse<{
  contacts: ContactResponse[];
}>;
export type PartnerListResponse = ApiListResponse<{
  partners: PartnerResponse[];
}>;
export type EventListResponse = ApiListResponse<{ events: EventResponse[] }>;

export type PartnerFormValues = Omit<
  PartnerResponse,
  "id" | "createdAt" | "updatedAt"
> & { id?: string; contactIds: string[] };

export type EventFormValues = Omit<
  EventResponse,
  "id" | "createdAt" | "updatedAt"
> & { id?: string; partnerIds: string[]; contactIds: string[] };

export type ContactFormValues = Omit<
  ContactResponse,
  "id" | "createdAt" | "updatedAt"
> & { id?: string };
export type ContactCreateResponse = ApiResponse<ContactResponse>;
export type ContactUpdateResponse = ApiResponse<ContactResponse>;

export type EventCreateResponse = ApiResponse<EventResponse>;
export type EventUpdateResponse = ApiResponse<EventResponse>;

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type PartnerCreateResponse = ApiResponse<PartnerResponse>;
export type PartnerUpdateResponse = ApiResponse<PartnerResponse>;

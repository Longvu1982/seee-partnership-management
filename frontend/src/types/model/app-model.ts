import type { Role } from "../enum/app-enum";

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
};

export type EventResponse = {
  id: string;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  documents: string[];
  funding_amount: number | null;
  funding_currency: string | null;
  student_reach_planned: number | null;
  student_reach_actual: number | null;
  feedback: string | null;
  rating: number | null;
  userId: string;
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
> & { id?: string };

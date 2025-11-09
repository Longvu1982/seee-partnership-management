import { User, Partner, Contact, Event } from '@prisma/client';

// _____________  User Types  _____________
export type TUserRegisterWrite = Omit<User, 'createdAt' | 'updatedAt'>;
export type TloginRead = Omit<User, 'password'>;
export type TloginRequest = Pick<User, 'username' | 'password'>;

// _____________  Partner Types  _____________
export type TPartnerCreate = Pick<Partner, 'name' | 'description' | 'sector' | 'address' | 'type'> & {
  contactIds: string[];
};
export type TPartnerUpdate = Partial<Pick<Partner, 'name' | 'description' | 'sector' | 'address' | 'type'>> & {
  contactIds: string[];
};

export type TContactCreate = Pick<Contact, 'name' | 'email' | 'phone' | 'description'>;
export type TContactUpdate = Partial<TContactCreate>;

export type TEventCreate = Pick<
  Event,
  | 'title'
  | 'description'
  | 'startDate'
  | 'endDate'
  | 'status'
  | 'documents'
  | 'funding_amount'
  | 'funding_currency'
  | 'student_reach_planned'
  | 'student_reach_actual'
  | 'feedback'
  | 'rating'
  | 'userId'
> & {
  partnerIds: string[];
  contactIds: string[];
};
export type TEventUpdate = Partial<TEventCreate>;

export type QueryDataModel = {
  pagination: {
    pageSize: number;
    pageIndex: number;
    totalCount: number;
  };
  searchText?: string;
  sort?: { column: string; type: 'asc' | 'desc' };
  filter?: [{ column: string; value: any | any[] }];
};

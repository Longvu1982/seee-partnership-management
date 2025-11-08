import { User, Partner } from '@prisma/client';

// _____________  User Types  _____________
export type TUserRegisterWrite = Omit<User, 'createdAt' | 'updatedAt'>;
export type TloginRead = Omit<User, 'password'>;
export type TloginRequest = Pick<User, 'username' | 'password'>;

// _____________  Partner Types  _____________
export type TPartnerCreate = Pick<Partner, 'name' | 'description' | 'sector' | 'address' | 'type'>;
export type TPartnerUpdate = Partial<Pick<Partner, 'name' | 'description' | 'sector' | 'address' | 'type'>>;

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

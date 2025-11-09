import { Prisma, Contact } from '@prisma/client';
import { QueryDataModel, TContactCreate, TContactUpdate } from '../types/general';
import { db } from '../utils/db.server';

export const listContacts = async (model: QueryDataModel): Promise<{ totalCount: number; contacts: Contact[] }> => {
  const { pagination, searchText, sort, filter } = model;

  const { pageSize, pageIndex } = pagination;
  const query: Prisma.ContactFindManyArgs = {
    where: {},
    orderBy: {},
    include: {},
  };

  if (pageSize) {
    query.skip = pageIndex * pageSize;
    query.take = pageSize;
  }

  if (filter?.length) {
    query.where = {
      ...query.where,
      AND: filter.map(({ column, value }) => ({
        [column]: Array.isArray(value) ? { in: value } : value,
      })),
    };
  }

  if (searchText) {
    query.where = {
      ...query.where,
      OR: [
        { name: { contains: searchText, mode: 'insensitive' } },
        { email: { contains: searchText, mode: 'insensitive' } },
        { phone: { contains: searchText, mode: 'insensitive' } },
      ],
    };
  }

  if (sort?.column) {
    query.orderBy = {
      [sort.column]: sort.type,
    };
  }

  const [totalCount, contacts] = await Promise.all([
    db.contact.count({ where: query.where }),
    db.contact.findMany(query),
  ]);

  return { totalCount, contacts };
};

export const createContact = async (data: TContactCreate): Promise<Contact> => {
  return db.contact.create({ data });
};

export const updateContact = async (id: string, data: TContactUpdate): Promise<Contact> => {
  return db.contact.update({ where: { id }, data });
};

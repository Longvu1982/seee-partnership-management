import { Prisma, Partner } from '@prisma/client';
import { QueryDataModel, TPartnerCreate, TPartnerUpdate } from '../types/general';
import { db } from '../utils/db.server';

export const createPartner = async (data: TPartnerCreate): Promise<Partner> => {
  const { contactIds = [], ...rest } = data;
  return db.partner.create({
    data: {
      ...rest,
      partnerContacts: { create: contactIds.map((contactId) => ({ contact: { connect: { id: contactId } } })) },
    },
  });
};

export const updatePartner = async (id: string, data: TPartnerUpdate): Promise<Partner> => {
  const { contactIds = [], ...rest } = data;
  return db.partner.update({
    where: { id },
    data: {
      ...rest,
      partnerContacts: {
        deleteMany: {},
        create: contactIds.map((contactId) => ({
          contact: { connect: { id: contactId } },
        })),
      },
    },
  });
};

export const updatePartnerStatus = async (id: string, isActive: boolean): Promise<Partner> => {
  return db.partner.update({
    where: { id },
    data: { isActive },
  });
};

export const deletePartner = async (id: string): Promise<Partner> => {
  return db.partner.delete({
    where: { id },
  });
};

export const listPartners = async (model: QueryDataModel): Promise<{ totalCount: number; partners: Partner[] }> => {
  const { pagination, searchText, sort, filter } = model;

  const { pageSize, pageIndex } = pagination;
  const query: Prisma.PartnerFindManyArgs = {
    where: {},
    orderBy: {},
    include: {
      partnerContacts: {
        include: {
          contact: true,
        },
      },
    },
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
        { description: { contains: searchText, mode: 'insensitive' } },
        { address: { contains: searchText, mode: 'insensitive' } },
      ],
    };
  }

  if (sort?.column) {
    query.orderBy = {
      [sort.column]: sort.type,
    };
  }

  const [totalCount, partners] = await Promise.all([
    db.partner.count({ where: query.where }),
    db.partner.findMany(query),
  ]);

  return { totalCount, partners };
};

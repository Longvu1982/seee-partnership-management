import { Prisma, Partner } from '@prisma/client';
import { QueryDataModel, TPartnerCreate, TPartnerUpdate } from '../types/general';
import { db } from '../utils/db.server';

export const createPartner = async (data: TPartnerCreate): Promise<Partner> => {
  return db.partner.create({
    data: {
      name: data.name,
      description: data.description,
      sector: data.sector,
      address: data.address,
      type: data.type,
    },
  });
};

export const updatePartner = async (id: string, data: TPartnerUpdate): Promise<Partner> => {
  return db.partner.update({
    where: { id },
    data,
  });
};

export const listPartners = async (model: QueryDataModel): Promise<{ totalCount: number; partners: Partner[] }> => {
  const { pagination, searchText, sort, filter } = model;

  const { pageSize, pageIndex } = pagination;
  const query: Prisma.PartnerFindManyArgs = {
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
        { description: { contains: searchText, mode: 'insensitive' } },
        { address: { contains: searchText, mode: 'insensitive' } },
        { sector: { contains: searchText, mode: 'insensitive' } },
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

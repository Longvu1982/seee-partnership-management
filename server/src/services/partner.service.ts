import { Prisma, Partner } from '@prisma/client';
import { QueryDataModel } from '../types/general';
import { db } from '../utils/db.server';

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

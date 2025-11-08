import { Prisma, Event } from '@prisma/client';
import { QueryDataModel, TloginRead } from '../types/general';
import { db } from '../utils/db.server';

export const listEvents = async (
  model: QueryDataModel,
  requestUser: TloginRead
): Promise<{ totalCount: number; events: Event[] }> => {
  const { pagination, searchText, sort, filter } = model;

  const { pageSize, pageIndex } = pagination;
  const query: Prisma.EventFindManyArgs = {
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
        { title: { contains: searchText, mode: 'insensitive' } },
        { description: { contains: searchText, mode: 'insensitive' } },
      ],
    };
  }

  if (sort?.column) {
    query.orderBy = {
      [sort.column]: sort.type,
    };
  }

  const [totalCount, events] = await Promise.all([db.event.count({ where: query.where }), db.event.findMany(query)]);

  return { totalCount, events };
};

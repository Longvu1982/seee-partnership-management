import { Prisma, Event } from '@prisma/client';
import { QueryDataModel, TloginRead, TEventCreate, TEventUpdate } from '../types/general';
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
    include: {
      eventContacts: {
        include: {
          contact: true,
        },
      },
      partnerEvents: {
        include: {
          partner: true,
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

export const createEvent = async (data: TEventCreate, requestUser: TloginRead): Promise<Event> => {
  const { partnerIds, contactIds, ...rest } = data;
  return db.event.create({
    data: {
      ...rest,
      userId: requestUser.id,
      partnerEvents: { create: partnerIds.map((partnerId) => ({ partner: { connect: { id: partnerId } } })) },
      eventContacts: { create: contactIds.map((contactId) => ({ contact: { connect: { id: contactId } } })) },
    },
  });
};

export const getEventByID = async (id: string): Promise<Event | null> => {
  return db.event.findUnique({
    where: { id },
    include: {
      eventContacts: {
        include: {
          contact: true,
        },
      },
      partnerEvents: {
        include: {
          partner: true,
        },
      },
      user: true,
    },
  });
};

export const updateEvent = async (id: string, data: TEventUpdate): Promise<Event> => {
  const { partnerIds = [], contactIds = [], ...eventData } = data;

  return db.event.update({
    where: { id },
    data: {
      ...eventData,

      partnerEvents: {
        deleteMany: {}, // remove all previous partner relations
        create: partnerIds.map((partnerId) => ({
          partner: { connect: { id: partnerId } },
        })),
      },
      eventContacts: {
        deleteMany: {}, // remove all previous contact relations
        create: contactIds.map((contactId) => ({
          contact: { connect: { id: contactId } },
        })),
      },
    },
  });
};

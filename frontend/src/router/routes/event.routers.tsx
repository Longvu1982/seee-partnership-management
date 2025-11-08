import { lazy } from "react";

const EventListPage = lazy(
  () => import("@/pages/private/event/list/EventListPage")
);

const EventDetailPage = lazy(
  () => import("@/pages/private/event/detail/EventDetailPage")
);

export const eventRoutes = [
  {
    path: "/event-list",
    element: <EventListPage />,
    roles: [],
  },
  {
    path: "/event-detail/:id",
    element: <EventDetailPage />,
    roles: [],
  },
];

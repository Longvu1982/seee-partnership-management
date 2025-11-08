import { lazy } from "react";

const UserListPage = lazy(
  () => import("@/pages/private/user/list/UserListPage")
);

export const userRoutes = [
  {
    path: "/user-list",
    element: <UserListPage />,
    roles: [],
  },
];

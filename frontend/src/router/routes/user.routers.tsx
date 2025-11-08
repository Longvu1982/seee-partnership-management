import { lazy } from "react";

const UserListPage = lazy(
  () => import("@/pages/private/user/list/UserListPage")
);

const AccountPage = lazy(() => import("@/pages/private/account/AccountPage"));

export const userRoutes = [
  {
    path: "/user-list",
    element: <UserListPage />,
    roles: [],
  },
  {
    path: "/account",
    element: <AccountPage />,
    roles: [],
  },
];

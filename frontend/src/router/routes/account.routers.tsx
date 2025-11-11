import { lazy } from "react";

const AccountPage = lazy(() => import("@/pages/private/account/AccountPage"));

export const accountRoutes = [
  {
    path: "/account",
    element: <AccountPage />,
  },
];

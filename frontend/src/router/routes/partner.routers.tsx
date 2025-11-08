import { lazy } from "react";

const PartnerListPage = lazy(
  () => import("@/pages/private/partner-list/PartnerListPage")
);

export const partnerRoutes = [
  {
    path: "/partner-list",
    element: <PartnerListPage />,
    roles: [],
  },
];

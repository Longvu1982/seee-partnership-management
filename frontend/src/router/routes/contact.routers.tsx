import { lazy } from "react";

const ContactListPage = lazy(
  () => import("@/pages/private/contact/list/ContactListPage")
);

export const contactRoutes = [
  {
    path: "/contact-list",
    element: <ContactListPage />,
    roles: [],
  },
];

import NotFound from "@/pages/public/not-found/404";
import useAuthStore from "@/store/auth";
import { createBrowserRouter } from "react-router-dom";
import { Home, Login, ProtectedRoutes } from "./routeLoader";
import { partnerRoutes } from "./routes/partner.routers";
import { eventRoutes } from "./routes/event.routers";
import { contactRoutes } from "./routes/contact.routers";
import { userRoutes } from "./routes/user.routers";

export const useRouter = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const getRoutesByRole = (routes: A[]) =>
    routes.filter(
      (route) => !route.roles?.length || route.roles.includes(role)
    );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <NotFound />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      element: <ProtectedRoutes />,
      children: getRoutesByRole([
        ...partnerRoutes,
        ...eventRoutes,
        ...contactRoutes,
        ...userRoutes,
      ]),
    },
  ]);

  return { router };
};

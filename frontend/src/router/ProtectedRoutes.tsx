import AvatarMenu from "@/components/avatar-menu/AvatarMenu";
import MainSidebar from "@/components/main-sidebar/MainSidebar";
import { Spinner } from "@/components/spinner/Spinner";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useAuthStore from "@/store/auth";
import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <MainSidebar />
      <div className="w-full overflow-x-hidden">
        <header className="h-12 shadow-sm flex items-center justify-between p-2 bg-background sticky top-0 z-10 border-b">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AvatarMenu />
          </div>
        </header>
        <main className="p-4">
          <Suspense fallback={<Spinner show={true} />} key={location.key}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedRoutes;

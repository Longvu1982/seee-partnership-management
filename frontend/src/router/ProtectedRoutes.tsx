import AvatarMenu from "@/components/avatar-menu/AvatarMenu";
import MainSidebar from "@/components/main-sidebar/MainSidebar";
import { Spinner } from "@/components/spinner/Spinner";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/auth";
import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sticky from "react-sticky-el";

const ProtectedRoutes = () => {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <MainSidebar />
      <div className="w-full overflow-x-hidden">
        <Sticky stickyClassName="z-10">
          <header className="h-12 shadow-sm flex items-center justify-between p-2 bg-background z-10 border-b">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <AvatarMenu />
            </div>
          </header>
        </Sticky>
        <main className={cn("p-4 md:px-8 md:py-6 overflow-x-hidden")}>
          <Suspense fallback={<Spinner show={true} />} key={location.key}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedRoutes;

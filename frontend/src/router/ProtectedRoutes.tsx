import MainSidebar from "@/components/main-sidebar/MainSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import useAuthStore from "@/store/auth";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <MainSidebar />
    </SidebarProvider>
  );
};

export default ProtectedRoutes;

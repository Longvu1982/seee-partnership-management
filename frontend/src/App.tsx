import { RouterProvider } from "react-router-dom";
import { Spinner } from "./components/spinner/Spinner";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { Toaster } from "./components/ui/sonner";
import { useRouter } from "./router/useRouter";
import { useTriggerLoading } from "./hooks/use-trigger-loading";
import useAuthStore from "./store/auth";
import { useEffect, useState } from "react";
import { apiAuthMe } from "./services/main/authenServices";

function App() {
  const { router } = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const { triggerLoading } = useTriggerLoading();

  useEffect(() => {
    triggerLoading(async () => {
      try {
        const { data } = await apiAuthMe();
        if (data.success) {
          setUser(data.data);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setIsAuthenticating(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="seee-ui-theme">
      {isAuthenticating && (
        <div className="fixed inset-0 z-10000 bg-background">
          Authenticating...
        </div>
      )}
      <RouterProvider router={router} />
      <Toaster duration={2000} position="top-center" />
      <Spinner />
    </ThemeProvider>
  );
}

export default App;

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTriggerLoading } from "@/hooks/use-trigger-loading";
import { apiLogIn } from "@/services/main/authenServices";
import useAuthStore from "@/store/auth";
import { Role } from "@/types/enum/app-enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().nonempty("Tên đăng nhập là bắt buộc"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 kí tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  const { triggerLoading } = useTriggerLoading();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    triggerLoading(async () => {
      const { data } = await apiLogIn(values);
      if (data.success) {
        setUser(data.data);
      }
    });
  };

  if (user?.id) {
    if (user.role === Role.ADMIN)
      return <Navigate to="/partner-list" replace />;
    return <Navigate to="/partner-list" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md p-8 space-y-6 rounded bg-secondary shadow-md"
        >
          <div className="space-y-2">
            <h2 className="text-center text-xs">Đăng nhập vào</h2>
            <div className="flex items-center gap-2 mx-auto justify-center">
              <span className="font-semibold">SEEE PARTNERSHIP MANAGEMENT</span>
            </div>
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên đăng nhập</FormLabel>
                <FormControl>
                  <Input placeholder="VD: seeeUser1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Đăng nhập
          </Button>
        </form>
      </Form>
    </div>
  );
}

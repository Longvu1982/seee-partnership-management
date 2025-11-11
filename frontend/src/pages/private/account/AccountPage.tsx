import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGetInitData } from "@/hooks/use-get-init-data";
import { useTriggerLoading } from "@/hooks/use-trigger-loading";
import { apiAuthMe } from "@/services/main/authenServices";
import { apiUpdateUser } from "@/services/main/userServices";
import useAuthStore from "@/store/auth";
import { Department, Role } from "@/types/enum/app-enum";
import type { UserFormValues, UserResponse } from "@/types/model/app-model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const getDepartmentLabel = (dept: Department) => {
  const labels = {
    [Department.ELECTRICAL]: "Điện",
    [Department.ELECTRONIC]: "Điện tử",
    [Department.COMMUNICATION]: "Kỹ thuật truyền thông",
    [Department.AUTOMATION]: "Tự động hóa",
    [Department.SCHOOLOFFICE]: "Văn phòng trường",
  };
  return labels[dept] || "Không xác định";
};

const getRoleLabel = (role: Role) => {
  return role === Role.ADMIN ? "Quản trị viên" : "Người dùng";
};

const AccountPage = () => {
  const logout = useAuthStore((state) => state.logout);
  const { triggerLoading } = useTriggerLoading();
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [userData, setUserData] = useState<UserResponse | null>(null);

  const onResetForm = (user: UserResponse) => {
    form.reset({
      id: user.id,
      name: user.name,
      email: user.email || "",
      phone: user.phone || "",
      currentPassword: "",
      password: "",
      confirmPassword: "",
    });
  };

  const schema = useMemo(() => {
    return z
      .object({
        name: z.string().min(1, "Tên là bắt buộc."),
        email: z
          .string()
          .email("Email không hợp lệ.")
          .optional()
          .nullable()
          .or(z.literal("")),
        phone: z.string().optional().nullable(),
        id: z.string().optional(),
        currentPassword: z.string().optional(),
        password: z.string().optional().or(z.literal("")),
        confirmPassword: z.string().optional().or(z.literal("")),
      })
      .superRefine((data, ctx) => {
        // Only validate password fields when editing password
        if (!isEditingPassword) return;

        // Check 1: currentPassword must be non-empty
        if (!data.currentPassword?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Vui lòng nhập mật khẩu hiện tại.",
            path: ["currentPassword"],
          });
        }

        // Check 2: password must be non-empty
        if (!data.password?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Vui lòng nhập mật khẩu mới.",
            path: ["password"],
          });
        }

        // Check 3: confirmPassword must be non-empty
        if (!data.confirmPassword?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Vui lòng xác nhận mật khẩu mới.",
            path: ["confirmPassword"],
          });
        }

        // Check 4: Password must be at least 6 characters
        if (data.password && data.password.trim().length < 6) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Mật khẩu mới phải có ít nhất 6 ký tự.",
            path: ["password"],
          });
        }

        // Check 5: Password and confirmPassword must match
        if (data.password?.trim() !== data.confirmPassword?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Mật khẩu xác nhận không khớp.",
            path: ["confirmPassword"],
          });
        }

        // Check 6: Password and currentPassword cannot be the same
        if (
          data.password &&
          data.currentPassword &&
          data.password.trim() === data.currentPassword.trim()
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Mật khẩu mới và mật khẩu hiện tại không được trùng nhau.",
            path: ["password"],
          });
        }
      });
  }, [isEditingPassword]);

  const form = useForm<
    UserFormValues & { currentPassword?: string; confirmPassword?: string }
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const fetchUserData = async () => {
    const { data } = await apiAuthMe();
    if (data.success) {
      const user = data.data;
      setUserData(user);
      onResetForm(user);
    } else {
      toast.error("Không thể tải thông tin tài khoản");
    }
  };

  useGetInitData(fetchUserData);

  const onSubmit = async (
    data: UserFormValues & {
      currentPassword?: string;
      confirmPassword?: string;
    }
  ) => {
    await triggerLoading(async () => {
      // Only include password if user is changing it
      if (!userData) return;
      const updateData: UserFormValues & { currentPassword?: string } = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        username: userData.username,
        role: userData.role,
        department: userData.department,
        currentPassword: data.currentPassword?.trim() || "",
        password: data.password?.trim() || "",
        isActive: userData.isActive,
      };

      const response = await apiUpdateUser(updateData);
      if (response.data.success) {
        if (!isEditingPassword) toast.success("Cập nhật thông tin thành công");
        else {
          toast.info("Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.");
          logout();
        }
      }
    });
  };

  if (!userData) {
    return (
      <div className="container mx-auto py-6">
        <p>Không thể tải thông tin tài khoản</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Tài khoản của tôi</h1>
        <p className="text-muted-foreground">
          Xem và chỉnh sửa thông tin tài khoản của bạn
        </p>
      </div>

      <div className="grid gap-6">
        {/* Account Info Card */}
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
            <CardDescription className="italic">
              Thông tin cơ bản không thể thay đổi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground cursor-text">
                  Tên đăng nhập
                </Label>
                <p className="text-sm font-medium">{userData.username}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground cursor-text">
                  Vai trò
                </Label>
                <p className="text-sm font-medium">
                  {getRoleLabel(userData.role)}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground cursor-text">
                  Khoa
                </Label>
                <p className="text-sm font-medium">
                  {getDepartmentLabel(userData.department)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editable Info Card */}
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>
              Cập nhật thông tin cá nhân của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tên <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Nhập email"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập số điện thoại"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />
                {/* Password Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Đổi mật khẩu</h3>
                    </div>

                    {!isEditingPassword && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingPassword(true)}
                      >
                        Đổi mật khẩu
                      </Button>
                    )}
                  </div>

                  {isEditingPassword && (
                    <>
                      {/* Current Password */}
                      <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Mật khẩu hiện tại
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="new-password"
                                type="password"
                                placeholder="Nhập mật khẩu hiện tại"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* New Password */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Mật khẩu mới
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="new-password"
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Confirm Password */}
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Xác nhận mật khẩu mới
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                autoComplete="new-password"
                                type="password"
                                placeholder="Nhập lại mật khẩu mới"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditingPassword(false);
                          form.setValue("currentPassword", "");
                          form.setValue("password", "");
                          form.setValue("confirmPassword", "");
                        }}
                      >
                        Hủy đổi mật khẩu
                      </Button>
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      onResetForm(userData);
                      setIsEditingPassword(false);
                    }}
                  >
                    Hủy Thay Đổi
                  </Button>
                  <Button type="submit">Lưu thay đổi</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;

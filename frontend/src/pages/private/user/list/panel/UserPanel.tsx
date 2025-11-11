/* eslint-disable react-refresh/only-export-components */
import Panel from "@/components/panel/Panel";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Department, Role } from "@/types/enum/app-enum";
import type { UserFormValues } from "@/types/model/app-model";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const schema = z
  .object({
    name: z.string().min(1, "Tên là bắt buộc."),
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự."),
    email: z
      .string()
      .email("Email không hợp lệ.")
      .optional()
      .nullable()
      .or(z.literal("")),
    phone: z.string().optional().nullable(),
    role: z.nativeEnum(Role, { message: "Vai trò là bắt buộc" }),
    department: z.nativeEnum(Department, { message: "Khoa là bắt buộc" }),
    isActive: z.boolean(),
    id: z.string().optional(),
    password: z.union([
      z.literal(""),
      z.string().min(3, "Mật khẩu phải có ít nhất 6 ký tự."),
    ]),
  })
  .refine(
    (data) => {
      // Password is required for create (no id), optional for edit
      if (!data.id && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Mật khẩu là bắt buộc khi tạo tài khoản mới.",
      path: ["password"],
    }
  );

export const initFormValues: UserFormValues = {
  name: "",
  username: "",
  email: "",
  phone: "",
  role: Role.USER,
  department: Department.SCHOOLOFFICE,
  isActive: true,
  password: "",
};

const roleOptions = [
  { value: Role.ADMIN, label: "Quản trị viên" },
  { value: Role.USER, label: "Người dùng" },
];

const departmentOptions = [
  { value: Department.ELECTRICAL, label: "Điện" },
  { value: Department.ELECTRONIC, label: "Điện tử" },
  { value: Department.COMMUNICATION, label: "KT truyền thông" },
  { value: Department.AUTOMATION, label: "Tự động hóa" },
  { value: Department.SCHOOLOFFICE, label: "Văn phòng trường" },
];

interface UserPanelProps {
  panelState: {
    isOpen: boolean;
    type: "create" | "edit";
  };
  setIsOpen: (value: boolean) => void;
  onSubmit: (data: UserFormValues) => void;
  form: UseFormReturn<UserFormValues, A, UserFormValues>;
}

const UserPanel = ({
  panelState,
  setIsOpen,
  onSubmit,
  form,
}: UserPanelProps) => {
  return (
    <Panel
      formId="userForm"
      title={
        panelState.type === "create"
          ? "Tạo tài khoản mới"
          : "Chỉnh sửa thông tin"
      }
      description="Điền thông tin"
      open={panelState.isOpen}
      onOpenChange={(o) => setIsOpen(o)}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-4"
          id="userForm"
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

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên đăng nhập <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tên đăng nhập"
                    {...field}
                    disabled={panelState.type === "edit"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mật khẩu{" "}
                  {panelState.type === "create" && (
                    <span className="text-red-500">*</span>
                  )}
                  {panelState.type === "edit" && (
                    <span className="text-muted-foreground text-xs">
                      {" "}
                      (để trống nếu không đổi)
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder={
                      panelState.type === "create"
                        ? "Nhập mật khẩu"
                        : "Nhập mật khẩu mới"
                    }
                    {...field}
                    value={field.value || ""}
                  />
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

          <div className="grid grid-cols-2 gap-2">
            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Vai trò <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Khoa <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn khoa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departmentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Active Status */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label htmlFor="isActive" className="font-medium">
                    {field.value ? "Hoạt động" : "Tạm ngưng"}
                  </Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Panel>
  );
};

export default UserPanel;

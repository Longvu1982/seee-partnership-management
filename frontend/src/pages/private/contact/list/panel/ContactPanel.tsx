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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ContactFormValues } from "@/types/model/app-model";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "Tên liên hệ là bắt buộc."),
  email: z.union([
    z.literal(""),
    z.string().email("Cần nhập email đúng định dạng"),
  ]),
  phone: z.string().optional(),
  description: z.string().optional(),
  id: z.string().optional(),
  isActive: z.boolean(),
});

export const initFormValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  description: "",
  isActive: true,
};

interface ContactPanelProps {
  panelState: { isOpen: boolean; type: "create" | "edit" };
  setIsOpen: (open: boolean) => void;
  onSubmit: (data: ContactFormValues) => void;
  form: UseFormReturn<ContactFormValues, A, ContactFormValues>;
}

const ContactPanel = ({
  panelState,
  setIsOpen,
  onSubmit,
  form,
}: ContactPanelProps) => {
  return (
    <Panel
      formId="contactForm"
      title={
        panelState.type === "create" ? "Thêm liên hệ" : "Chỉnh sửa liên hệ"
      }
      description="Nhập thông tin liên hệ."
      open={panelState.isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form
          id="contactForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-4"
        >
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái hoạt động</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Switch
                      {...field}
                      id="parterActive"
                      value={undefined}
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                    />
                    <Label
                      htmlFor="parterActive"
                      className="font-normal w-[75px]"
                    >
                      {field.value ? "Hoạt động" : "Tạm ngưng"}
                    </Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Tên liên hệ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SĐT</FormLabel>
                <FormControl>
                  <Input placeholder="Số điện thoại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    spellCheck={false}
                    placeholder="Mô tả"
                    {...field}
                    value={field.value as string}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Panel>
  );
};

export default ContactPanel;

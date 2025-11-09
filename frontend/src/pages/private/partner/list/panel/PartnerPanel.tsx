/* eslint-disable react-refresh/only-export-components */
import MultipleSelector from "@/components/multi-select/MutipleSelect";
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
import type { PartnerFormValues } from "@/types/model/app-model";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useGetOptions } from "../partner.utils";

export const schema = z.object({
  name: z.string().min(1, "Tên đối tác là bắt buộc."),
  sector: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  id: z.string().optional(),
  isActive: z.boolean(),
  contactIds: z.array(z.string()).default([]),
});

export const initFormValues = {
  name: "",
  sector: "",
  address: "",
  description: "",
  type: "",
  isActive: true,
  contactIds: [],
};

interface PartnerPanelProps {
  panelState: {
    isOpen: boolean;
    type: "create" | "edit";
  };
  setIsOpen: (value: boolean) => void;
  onSubmit: (data: PartnerFormValues) => void;
  form: UseFormReturn<PartnerFormValues, A, PartnerFormValues>;
}

const PartnerPanel = ({
  panelState,
  setIsOpen,
  onSubmit,
  form,
}: PartnerPanelProps) => {
  const { contactOptions } = useGetOptions();

  return (
    <Panel
      formId="partnerForm"
      title={
        panelState.type === "create" ? "Tạo đối tác mới" : "Chỉnh sửa thông tin"
      }
      description="Điền thông tin"
      open={panelState.isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form
          id="partnerForm"
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
                  <Input placeholder="Nhập tên đối tác" {...field} />
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
                    placeholder="Nhập mô tả"
                    {...field}
                    value={field.value as string}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh sách liên hệ</FormLabel>
                <FormControl>
                  <MultipleSelector
                    placeholder="Chọn liên hệ"
                    options={contactOptions}
                    value={contactOptions.filter((item) =>
                      (field.value ?? []).includes?.(item.value)
                    )}
                    onChange={(options) =>
                      field.onChange(options.map((item) => item.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập địa chỉ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lĩnh vực</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập lĩnh vực" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại</FormLabel>
                <FormControl>
                  <Input placeholder="Doanh nghiệp, Cá nhân, ..." {...field} />
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

export default PartnerPanel;

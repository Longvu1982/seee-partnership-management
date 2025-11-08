/* eslint-disable react-refresh/only-export-components */
import Panel from "@/components/panel/Panel";
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
import type { PartnerFormValues } from "@/types/model/app-model";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "Tên đối tác là bắt buộc."),
  sector: z.string().optional(),
  address: z.string().optional(),
  id: z.string().optional(),
});

export const initFormValues = {
  name: "",
  sector: "",
  address: "",
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
          onSubmit={form.handleSubmit(onSubmit, console.log)}
          className="space-y-4 p-4"
        >
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

          <Button type="submit" className="w-full">
            Đăng nhập
          </Button>
        </form>
      </Form>
    </Panel>
  );
};

export default PartnerPanel;

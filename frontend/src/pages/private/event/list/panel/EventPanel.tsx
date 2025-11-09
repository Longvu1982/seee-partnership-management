/* eslint-disable react-refresh/only-export-components */
import ComboBoxForm from "@/components/combo-box/ComboBoxForm";
import Panel from "@/components/panel/Panel";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { EventStatus } from "@/types/enum/app-enum";
import type { EventFormValues } from "@/types/model/app-model";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  eventStatusOptions,
  getEventStatusBadge,
  useGetOptions,
} from "../event.utils";
import { Badge } from "@/components/ui/badge";
import MultipleSelector from "@/components/multi-select/MutipleSelect";

export const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Tên dự án là bắt buộc."),
  description: z.string().optional(),
  status: z.string(),
  documents: z.array(z.string()).default([]),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  feedback: z.string().optional(),
  funding_amount: z.number().optional(),
  funding_currency: z.string().optional(),
  rating: z.number().optional(),
  student_reach_actual: z.number().optional(),
  student_reach_planned: z.number().optional(),
  userId: z.string().optional(),
  contactIds: z.array(z.string()).default([]),
  partnerIds: z.array(z.string()).default([]),
});

export const initFormValues: EventFormValues = {
  title: "",
  description: "",
  status: EventStatus.PROSPECT,
  documents: [],
  startDate: null,
  endDate: null,
  feedback: "",
  funding_amount: 0,
  funding_currency: "",
  rating: 0,
  student_reach_actual: 0,
  student_reach_planned: 1,
  userId: "",
  contactIds: [],
  partnerIds: [],
};

interface EventPanelProps {
  panelState: { isOpen: boolean; type: "create" | "edit" };
  setIsOpen: (open: boolean) => void;
  onSubmit: (data: EventFormValues) => void;
  form: UseFormReturn<EventFormValues, A, EventFormValues>;
}

const EventPanel = ({
  panelState,
  setIsOpen,
  onSubmit,
  form,
}: EventPanelProps) => {
  const { partnerOptions, contactOptions } = useGetOptions();

  return (
    <Panel
      formId="eventForm"
      title={
        panelState.type === "create" ? "Thêm sự kiện" : "Chỉnh sửa sự kiện"
      }
      description="Nhập thông tin sự kiện."
      open={panelState.isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form
          id="eventForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-4"
        >
          <FormField
            control={form.control}
            name="title"
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

          <ComboBoxForm
            triggerButtonProps={{
              variant: "ghost",
              className: "pl-0!",
            }}
            name="status"
            form={form}
            searchable={false}
            label="Trạng thái"
            options={eventStatusOptions}
            renderOption={(option) => {
              const { variant, text } =
                getEventStatusBadge(option.value as EventStatus) ?? {};
              return <Badge variant={variant}>{text}</Badge>;
            }}
          />

          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Ngày bắt đầu</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value as Date}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Ngày kết thúc</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value as Date}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phản hồi</FormLabel>
                <FormControl>
                  <Textarea
                    spellCheck={false}
                    placeholder="Phản hồi"
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
                <FormLabel>Liên hệ (nhà trường)</FormLabel>
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
            name="partnerIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đối tác</FormLabel>
                <FormControl>
                  <MultipleSelector
                    placeholder="Chọn đối tác"
                    options={partnerOptions}
                    value={partnerOptions.filter((item) =>
                      (field.value ?? []).includes?.(item.value)
                    )}
                    onChange={(options) =>
                      field.onChange(options.map((item) => item.value))
                    }
                    // {...field}
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

export default EventPanel;

/* eslint-disable react-refresh/only-export-components */
import MultipleSelector from "@/components/multi-select/MutipleSelect";
import Panel from "@/components/panel/Panel";
import TagsInput from "@/components/tags-input/TagsInput";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { PartnerRank, PartnerSector, PartnerType } from "@/types/enum/app-enum";
import type { PartnerFormValues } from "@/types/model/app-model";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  getPartnerRankIcon,
  getPartnerSectorLabel,
  partnerRankOptions,
  partnerSectorOptions,
  partnerTypeOptions,
  useGetOptions,
} from "../partner.utils";

export const schema = z.object({
  name: z.string().min(1, "Tên đối tác là bắt buộc."),
  address: z.string().optional(),
  description: z.string().optional(),
  id: z.string().optional(),
  isActive: z.boolean(),
  contactIds: z.array(z.string()).default([]),
  otherRank: z.string().optional().nullable(),
  otherTypeName: z.string().optional().nullable(),
  otherSectorName: z.string().optional().nullable(),
  rank: z.nativeEnum(PartnerRank, { message: "Xếp hạng là bắt buộc" }),
  type: z.nativeEnum(PartnerType, { message: "Loại đối tác là bắt buộc" }),
  sector: z
    .nativeEnum(PartnerSector)
    .array()
    .min(1, "Cần chọn ít nhất 1 lĩnh vực"),
  tags: z.array(z.string()).optional(),
});

export const initFormValues: PartnerFormValues = {
  name: "",
  address: "",
  description: "",
  isActive: true,
  contactIds: [],
  otherSectorName: "",
  otherTypeName: "",
  otherRank: "",
  sector: [],
  rank: PartnerRank.NOTYET,
  type: null,
  tags: [],
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

  const selectedType = form.watch("type");
  const selectedSectors = form.watch("sector") ?? [];
  const selectedRank = form.watch("rank");

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
          onSubmit={form.handleSubmit(onSubmit, (e) => {
            console.log(e);
          })}
          className="space-y-6 p-4"
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
            name="tags"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Nhãn/từ khóa</FormLabel>
                  <FormControl>
                    <TagsInput
                      tags={field.value}
                      {...field}
                      placeholder="Thêm nhãn"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
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

          <div className="grid grid-cols-2 gap-2">
            <div>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại đối tác</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value as string}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn loại đối tác" />
                        </SelectTrigger>
                        <SelectContent>
                          {partnerTypeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedType === PartnerType.OTHER && (
                <FormField
                  control={form.control}
                  name="otherTypeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Nhập loại khác"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div>
              <FormField
                control={form.control}
                name="rank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xếp hạng</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value as string}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn loại đối tác" />
                        </SelectTrigger>
                        <SelectContent>
                          {partnerRankOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {getPartnerRankIcon(opt.value)}
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedRank === PartnerRank.OTHER && (
                <FormField
                  control={form.control}
                  name="otherRank"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Nhập hạng khác"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <div>
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel className="mb-4">Lĩnh vực</FormLabel>
                  <div className="flex flex-wrap gap-4">
                    {partnerSectorOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          id={`sector-${option.value}`}
                          checked={field.value?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            let newValue = Array.isArray(field.value)
                              ? [...field.value]
                              : [];
                            if (checked) {
                              if (!newValue.includes(option.value))
                                newValue.push(option.value);
                            } else {
                              newValue = newValue.filter(
                                (v) => v !== option.value
                              );
                            }
                            field.onChange(newValue);
                          }}
                        />
                        <label
                          htmlFor={`sector-${option.value}`}
                          className="text-sm"
                        >
                          {getPartnerSectorLabel(option.value)}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedSectors.includes(PartnerSector.OTHERS) && (
              <FormField
                control={form.control}
                name="otherSectorName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Nhập lĩnh vực khác"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </form>
      </Form>
    </Panel>
  );
};

export default PartnerPanel;

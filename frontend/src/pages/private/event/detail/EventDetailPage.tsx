import { DocumentsTable } from "@/components/documents-table/DocumentsTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTriggerLoading } from "@/hooks/use-trigger-loading";
import { apiGetEventById } from "@/services/main/eventServices";
import type { EventResponse } from "@/types/model/app-model";
import { useContactListModal } from "@/utils/contact-list-modal";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  UserCircle,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getEventStatusBadge } from "../list/event.utils";
import {
  getPartnerSectorLabel,
  getPartnerTypeLabel,
} from "@/pages/private/partner/list/partner.utils";
import { PartnerSector, PartnerType } from "@/types/enum/app-enum";

function StarRating({
  rating,
  maxRating = 5,
}: {
  rating: number;
  maxRating?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: maxRating }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < Math.floor(rating)
                ? "fill-amber-400 text-amber-400"
                : i < rating
                ? "fill-amber-200 text-amber-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<EventResponse>(
    {} as EventResponse
  );
  const { triggerLoading } = useTriggerLoading();
  const { openContactListModal } = useContactListModal();

  const { variant, text } = getEventStatusBadge(eventData.status);

  useEffect(() => {
    if (!id) {
      toast.error("Id không tồn tại");
      navigate("/event-list");
      return;
    }

    const fetchEvent = async () => {
      await triggerLoading(async () => {
        try {
          const { data } = await apiGetEventById(id);
          if (data.success) {
            setEventData(data.data);
          } else {
            toast.error("Có lỗi xảy ra tải sự kiện");
            navigate("/event-list");
          }
        } catch {
          toast.error("Có lỗi xảy ra tải sự kiện");
          navigate("/event-list");
        }
      });
    };

    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return format(new Date(date), "d 'tháng' M, yyyy", { locale: vi });
  };

  const formatDateTime = (date: Date | string | null) => {
    if (!date) return "-";
    return format(new Date(date), "HH:mm 'ngày' d 'tháng' M, yyyy", {
      locale: vi,
    });
  };

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount || !currency) return "-";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (!eventData.id) return <></>;

  return (
    <div className="px-0 md:px-2 pt-0 pb-12 container mx-auto max-w-6xl">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-start justify-between gap-4 mb-10">
          <div className="flex-1">
            <Button
              variant="link"
              size="icon"
              onClick={() => navigate("/event-list")}
              className="w-fit mb-4"
            >
              <ArrowLeft /> Quay lại danh sách
            </Button>
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              {eventData.title}
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant={variant}>{text}</Badge>
            </div>
          </div>
        </div>

        {/* Event Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3 p-4  rounded-lg border border-border">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Ngày bắt đầu
              </p>
              <p className="text-sm font-medium text-card-foreground">
                {formatDate(eventData.startDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4  rounded-lg border border-border">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Ngày kết thúc
              </p>
              <p className="text-sm font-medium text-card-foreground">
                {formatDate(eventData.endDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Event Description */}
        <div className="p-6  rounded-lg border border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Mô tả sự kiện
          </h2>
          <p className="text-sm text-card-foreground leading-relaxed">
            {eventData.description || "Chưa có mô tả"}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="p-6  rounded-lg border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Sinh viên (Dự kiến)
            </span>
          </div>
          <p className="text-2xl font-semibold text-card-foreground">
            {eventData.student_reach_planned}
          </p>
        </div>
        <div className="p-6  rounded-lg border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Sinh viên (Thực tế)
            </span>
          </div>
          <p className="text-2xl font-semibold text-card-foreground">
            {eventData.student_reach_actual}
          </p>
        </div>
        <div className="p-6  rounded-lg border border-border">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Kinh phí
            </span>
          </div>
          <p className="text-2xl font-semibold text-card-foreground">
            {formatCurrency(
              eventData.funding_amount,
              eventData.funding_currency
            )}
            {/* {eventData.funding_currency} */}
          </p>
        </div>
      </div>

      {/* Rating and Feedback Section */}
      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rating Card */}
        <div className="p-6  rounded-lg border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Đánh giá sự kiện
            </h3>
          </div>
          <div className="space-y-2">
            <StarRating rating={eventData.rating ?? 0} />
            <p className="text-sm text-muted-foreground">Đánh giá trung bình</p>
          </div>
        </div>

        {/* Feedback Card */}
        <div className="p-6  rounded-lg border border-border">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Nhận xét</h3>
          </div>
          <p className="text-sm text-card-foreground leading-relaxed">
            {eventData.feedback || "Chưa có nhận xét"}
          </p>
        </div>
      </section>

      {/* Documents Section */}
      {eventData.documents && eventData.documents.length > 0 && (
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Tài liệu
            </h2>
            <p className="text-muted-foreground">
              Danh sách tài liệu liên quan đến sự kiện
            </p>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-semibold">
                      {eventData.documents.length} tài liệu
                    </span>
                  </div>
                </div>
                <DocumentsTable documents={eventData.documents} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contacts Section */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Liên hệ (nhà trường)
          </h2>
          <p className="text-muted-foreground">
            Những người liên hệ chính cho sự kiện này
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventData.eventContacts &&
            eventData.eventContacts.length > 0 &&
            eventData.eventContacts.map((ec) => (
              <div
                key={ec.id}
                className="p-6  rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4 flex-col md:flex-row gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-1">
                      {ec.contact.name}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-900">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          ec.contact.isActive ? "bg-blue-600" : "bg-gray-400"
                        }`}
                      />
                      <span className="text-xs font-medium text-blue-800 dark:text-blue-100">
                        {ec.contact.isActive
                          ? "Đang hoạt động"
                          : "Không hoạt động"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {ec.contact.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                      <a
                        href={`mailto:${ec.contact.email}`}
                        className="text-primary hover:underline break-all"
                      >
                        {ec.contact.email}
                      </a>
                    </div>
                  )}
                  {ec.contact.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                      <a
                        href={`tel:${ec.contact.phone}`}
                        className="text-primary hover:underline"
                      >
                        {ec.contact.phone}
                      </a>
                    </div>
                  )}
                </div>

                {ec.contact.description && (
                  <>
                    <Separator className="mt-6" />
                    <div className="mt-4 pt-4 border-border dark:border-white">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                        Mô tả
                      </p>
                      <div className="text-sm text-card-foreground whitespace-pre-wrap">
                        {ec.contact.description}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      </section>

      {/* Partners Section */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Đối tác
          </h2>
          <p className="text-muted-foreground">
            Các tổ chức hợp tác trong sự kiện này
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventData.partnerEvents &&
            eventData.partnerEvents.length > 0 &&
            eventData.partnerEvents.map((pe) => (
              <div
                key={pe.id}
                className="p-6  rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => openContactListModal(pe.partner)}
              >
                <div className="flex items-start justify-between mb-3 flex-col sm:flex-row gap-2">
                  <h3 className="text-lg font-semibold text-card-foreground flex-1">
                    {pe.partner.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium shrink-0 ${
                      pe.partner.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        pe.partner.isActive ? "bg-green-600" : "bg-gray-400"
                      }`}
                    />
                    {pe.partner.isActive ? "Đang hoạt động" : "Không hoạt động"}
                  </span>
                </div>

                <Separator />

                <div className="pt-3 space-y-3">
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {pe.partner.type && (
                      <p>
                        <span className="font-medium">Loại:</span>{" "}
                        {pe.partner.type === PartnerType.OTHER
                          ? pe.partner.otherTypeName ||
                            getPartnerTypeLabel(pe.partner.type)
                          : getPartnerTypeLabel(pe.partner.type)}
                      </p>
                    )}
                    {pe.partner.sector && pe.partner.sector.length > 0 && (
                      <p>
                        <span className="font-medium">Lĩnh vực:</span>{" "}
                        {pe.partner.sector
                          .map((s) => {
                            if (s === PartnerSector.OTHERS) {
                              return (
                                pe.partner.otherSectorName ||
                                getPartnerSectorLabel(s)
                              );
                            }
                            return getPartnerSectorLabel(s);
                          })
                          .join(", ")}
                      </p>
                    )}
                    {pe.partner.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                        <p>{pe.partner.address}</p>
                      </div>
                    )}
                  </div>

                  {pe.partner.partnerContacts !== undefined && (
                    <div className="pt-2">
                      {pe.partner.partnerContacts &&
                      pe.partner.partnerContacts.length > 0 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            openContactListModal(pe.partner);
                          }}
                        >
                          <UserCircle className="h-3 w-3 mr-1.5" />
                          Thông tin liên hệ +{pe.partner.partnerContacts.length}
                        </Button>
                      ) : (
                        <div className="text-xs text-muted-foreground text-center py-1.5">
                          Không có liên hệ
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Event Metadata */}
      <section className="p-6  rounded-lg border border-border">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
          Thông tin sự kiện
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">ID sự kiện</p>
            <p className="text-card-foreground text-xs break-all">
              {eventData.id}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Người tạo sự kiện</p>
            <p className="text-card-foreground text-xs break-all">
              {eventData.user?.name}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Tạo lúc</p>
            <p className="text-card-foreground text-xs">
              {formatDateTime(eventData.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Cập nhật lúc</p>
            <p className="text-card-foreground text-xs">
              {formatDateTime(eventData.updatedAt)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;

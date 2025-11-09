import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGetEventById } from "@/services/main/eventServices";
import type { EventResponse } from "@/types/model/app-model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/spinner/Spinner";
import { getEventStatusBadge } from "../list/event.utils";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Star,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useTriggerLoading } from "@/hooks/use-trigger-loading";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const { triggerLoading } = useTriggerLoading();

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
            setEvent(data.data);
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

  if (!event) {
    return <Spinner show={true} />;
  }

  const { variant: statusVariant, text: statusText } = getEventStatusBadge(
    event.status
  );

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount || !currency) return "-";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/event-list")}
        >
          <ArrowLeft />
        </Button>
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
          Chi tiết sự kiện
        </h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant}>{statusText}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          {event.description && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Mô tả</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {event.description}
              </p>
            </div>
          )}

          <Separator />

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold mb-1">Ngày bắt đầu</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(event.startDate)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold mb-1">Ngày kết thúc</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(event.endDate)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Funding Information */}
          {(event.funding_amount || event.funding_currency) && (
            <>
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <h3 className="text-sm font-semibold">Thông tin tài trợ</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Số tiền
                    </p>
                    <p className="text-sm font-medium">
                      {formatCurrency(
                        event.funding_amount,
                        event.funding_currency
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Loại tiền tệ
                    </p>
                    <p className="text-sm font-medium">
                      {event.funding_currency || "-"}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Student Reach */}
          {(event.student_reach_planned || event.student_reach_actual) && (
            <>
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <h3 className="text-sm font-semibold">Số lượng sinh viên</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Kế hoạch
                    </p>
                    <p className="text-sm font-medium">
                      {event.student_reach_planned?.toLocaleString("vi-VN") ||
                        "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Thực tế
                    </p>
                    <p className="text-sm font-medium">
                      {event.student_reach_actual?.toLocaleString("vi-VN") ||
                        "-"}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Feedback and Rating */}
          {(event.feedback || event.rating !== null) && (
            <>
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <h3 className="text-sm font-semibold">
                    Đánh giá và phản hồi
                  </h3>
                </div>
                <div className="space-y-4 ml-8">
                  {event.rating !== null && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Đánh giá
                      </p>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {event.rating}/5
                        </span>
                      </div>
                    </div>
                  )}
                  {event.feedback && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Phản hồi
                      </p>
                      <p className="text-sm whitespace-pre-line">
                        {event.feedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Documents */}
          {event.documents && event.documents.length > 0 && (
            <>
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <h3 className="text-sm font-semibold">Tài liệu</h3>
                </div>
                <div className="ml-8">
                  <ul className="space-y-2">
                    {event.documents.map((doc, index) => (
                      <li key={index} className="text-sm">
                        <a
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {doc}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Contacts */}
          {event.eventContacts && event.eventContacts.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-4">
                  Liên hệ liên quan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.eventContacts.map((eventContact) => {
                    const contact = eventContact.contact;
                    return (
                      <Card key={contact.id} className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">{contact.name}</h4>
                          {contact.email && (
                            <p className="text-sm text-muted-foreground">
                              Email: {contact.email}
                            </p>
                          )}
                          {contact.phone && (
                            <p className="text-sm text-muted-foreground">
                              Điện thoại: {contact.phone}
                            </p>
                          )}
                          {contact.description && (
                            <p className="text-sm text-muted-foreground">
                              {contact.description}
                            </p>
                          )}
                          <Badge
                            variant={contact.isActive ? "default" : "secondary"}
                          >
                            {contact.isActive ? "Hoạt động" : "Tạm ngưng"}
                          </Badge>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Partners */}
          {event.partnerEvents && event.partnerEvents.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-4">
                  Đối tác liên quan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.partnerEvents.map((partnerEvent) => {
                    const partner = partnerEvent.partner;
                    return (
                      <Card key={partner.id} className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">{partner.name}</h4>
                          {partner.sector && (
                            <p className="text-sm text-muted-foreground">
                              Lĩnh vực: {partner.sector}
                            </p>
                          )}
                          {partner.type && (
                            <p className="text-sm text-muted-foreground">
                              Loại: {partner.type}
                            </p>
                          )}
                          {partner.address && (
                            <p className="text-sm text-muted-foreground">
                              Địa chỉ: {partner.address}
                            </p>
                          )}
                          {partner.description && (
                            <p className="text-sm text-muted-foreground">
                              {partner.description}
                            </p>
                          )}
                          <Badge
                            variant={partner.isActive ? "default" : "secondary"}
                          >
                            {partner.isActive ? "Hoạt động" : "Tạm ngưng"}
                          </Badge>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Ngày tạo</p>
              <p className="font-medium">{formatDateTime(event.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Ngày cập nhật</p>
              <p className="font-medium">{formatDateTime(event.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetailPage;

"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import {
  ClipboardList,
  Package,
  Truck,
  CheckCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/utils/axios";
import { Loading } from "@/app/components/loading";
import type { Order, OrderItem, OrderStatus, PaymentMethod } from "@/types/Order";
import type { Delivery } from "@/types/Delivery";

interface ApiResponse<T> {
  status: number;
  message?: string;
  data?: T;
}

const statusColor: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-700",
};

const statusLabel: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPED: "Đang vận chuyển",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

const paymentMethodLabel: Record<PaymentMethod, string> = {
  COD: "Thanh toán khi nhận hàng",
  BANK_TRANSFER: "Chuyển khoản ngân hàng",
};

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  minimumFractionDigits: 0,
});

const formatCurrency = (value?: number | null) => {
  if (typeof value !== "number") return "—";
  return currencyFormatter.format(value);
};

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

// Lấy thumbnail ảnh sản phẩm, tái sử dụng logic giống trang pets
const getItemImage = (petImage?: string | null) => {
  if (petImage) {
    if (petImage.startsWith("http://") || petImage.startsWith("https://")) {
      return petImage;
    }
    if (petImage.startsWith("/")) {
      return petImage;
    }
  }
  return "/assets/imgs/imgPet/cat-6593947_1280.jpg";
};

const fetchOrderDetail = async (orderId: string): Promise<Order> => {
  const response = await axiosInstance.get<ApiResponse<Order>>(
    `/orders/${orderId}`
  );
  const { status, message, data } = response.data;
  if (status !== 200 || !data) {
    throw new Error(message || "Không tìm thấy đơn hàng");
  }
  return data;
};

const fetchDelivery = async (orderId: string): Promise<Delivery | null> => {
  const response = await axiosInstance.get<Delivery | null>(
    `/pets/orders/${orderId}/delivery`
  );

  // BE trả 204 No Content khi chưa có delivery
  if (response.status === 204 || !response.data) {
    return null;
  }

  return response.data;
};

const DELIVERY_STEPS = [
  { key: "PREPARING", label: "Chuẩn bị", icon: ClipboardList },
  { key: "SHIPPED", label: "Đã đóng gói", icon: Package },
  { key: "IN_TRANSIT", label: "Đang giao", icon: Truck },
  { key: "DELIVERED", label: "Đã giao hàng", icon: CheckCircle2 },
] as const;

const getActiveStepIndex = (delivery: Delivery | null): number => {
  if (!delivery) return -1;

  // Ưu tiên dùng currentStatus, nếu rỗng thì fallback sang timeline[0].status
  let rawStatus = delivery.currentStatus || "";
  if (!rawStatus && delivery.timeline && delivery.timeline.length > 0) {
    rawStatus = delivery.timeline[0].status || "";
  }

  const status = rawStatus.toLowerCase();

  let index = -1;
  if (status.includes("chuẩn bị")) index = 0;
  else if (status.includes("đóng gói")) index = 1;
  else if (status.includes("đang giao")) index = 2;
  else if (status.includes("đã giao")) index = 3;

  if (index === -1) {
    // Nếu có delivery mà không map được thì mặc định sáng bước 1
    index = 0;
  }

  console.log("[DeliveryStatus] resolvedStatus:", rawStatus, "=> step:", index);
  return index;
};

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const orderId = params?.orderId;

  const {
    data: order,
    error,
    isLoading,
    mutate,
  } = useSWR<Order>(
    orderId ? `/orders/${orderId}` : null,
    async () => {
      console.log("[OrderDetail] Bắt đầu gọi API", orderId);
      const result = await fetchOrderDetail(orderId as string);
      console.log("[OrderDetail] Nhận dữ liệu", result);
      return result;
    },
    {
      revalidateOnFocus: false,
      onError(err) {
        console.error("[OrderDetail] Lỗi khi load", orderId, err);
      },
    }
  );

  const { data: delivery } = useSWR<Delivery | null>(
    orderId ? `/pets/orders/${orderId}/delivery` : null,
    () => fetchDelivery(orderId as string),
    {
      revalidateOnFocus: false,
    }
  );

  const subtotal = useMemo(() => {
    if (!order?.orderItems) return 0;
    return order.orderItems.reduce(
      (sum, item) => sum + (item.totalPrice ?? item.price * item.quantity),
      0
    );
  }, [order?.orderItems]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="mb-4 text-lg font-semibold text-red-500">
          Không thể tải chi tiết đơn hàng
        </p>
        <p className="mb-6 text-slate-600">{error.message}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push("/orders")} variant="outline">
            Về danh sách
          </Button>
          <Button onClick={() => mutate()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-slate-600">
        Không tìm thấy đơn hàng #{orderId}
      </div>
    );
  }

  const orderItems: OrderItem[] = order.orderItems ?? [];
  const shippingFee = order.shippingFee ?? 0;
  const discount = order.discountAmount ?? 0;
  const paymentMethodText = order.paymentMethod
    ? paymentMethodLabel[order.paymentMethod]
    : "Chưa cập nhật";

  const activeStep = getActiveStepIndex(delivery || null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 text-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Đơn hàng</p>
          <h1 className="text-2xl font-semibold text-slate-900">
            #{order.orderId}
          </h1>
          <p className="text-sm text-slate-600">
            Tạo lúc {formatDateTime(order.createdAt)}
          </p>
        </div>
        <Badge
          className={`${statusColor[order.status]} border-0 px-4 py-2 text-sm font-semibold`}
        >
          {statusLabel[order.status] || order.status}
        </Badge>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Đơn hàng đang ở trạng thái{" "}
        <span className="font-semibold text-slate-900">
          {statusLabel[order.status] || order.status}
        </span>
        .
      </p>

      <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">
          Trạng thái giao hàng
        </h2>
        {delivery ? (
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {DELIVERY_STEPS.map((step, index) => {
              const isActive = activeStep === index;
              const isCompleted = activeStep > index;
              const Icon = step.icon;

              const colorConfig = [
                {
                  circle: "bg-blue-50 text-blue-600",
                  text: "text-blue-600",
                },
                {
                  circle: "bg-purple-50 text-purple-600",
                  text: "text-purple-600",
                },
                {
                  circle: "bg-orange-50 text-orange-600",
                  text: "text-orange-600",
                },
                {
                  circle: "bg-emerald-50 text-emerald-600",
                  text: "text-emerald-600",
                },
              ][index];

              const circleClass = isActive
                ? colorConfig.circle
                : "bg-slate-100 text-slate-400";

              const textClass = isActive
                ? colorConfig.text
                : "text-slate-400";

              return (
                <div key={step.key} className="flex items-center gap-2">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border ${circleClass} ${
                      isActive
                        ? "border-current shadow-sm"
                        : "border-slate-200"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-sm font-medium ${textClass}`}
                  >
                    {step.label}
                  </span>
                  {index < DELIVERY_STEPS.length - 1 && (
                    <span
                      className={`mx-1 ${
                        isCompleted ? "text-slate-400" : "text-slate-300"
                      }`}
                    >
                      {">"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Đơn hàng chưa có thông tin giao hàng.
          </p>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 text-sm font-semibold uppercase text-slate-500">
            <span>Sản phẩm</span>
            <span>Tổng</span>
          </div>

          {orderItems.length === 0 ? (
            <p className="py-6 text-sm text-slate-500">
              Đơn hàng chưa có sản phẩm.
            </p>
          ) : (
            orderItems.map((item) => {
              const imgSrc = getItemImage(item.petImage);
              return (
                <div
                  key={`${item.petId}-${item.petName}`}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 text-sm text-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                      <Image
                        src={imgSrc}
                        alt={item.petName}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-slate-900">
                      {item.petName}{" "}
                      <span className="text-slate-500">
                        × {item.quantity}
                      </span>
                    </span>
                  </div>
                  <span className="text-right font-semibold text-slate-900">
                    {formatCurrency(
                      item.totalPrice ?? item.price * item.quantity
                    )}
                  </span>
                </div>
              );
            })
          )}

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Tạm tính:</span>
              <span className="text-right font-semibold text-slate-900">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Phí vận chuyển:</span>
              <span className="text-right font-semibold text-slate-900">
                {formatCurrency(shippingFee)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Giảm giá:</span>
              <span className="text-right font-semibold text-emerald-600">
                -{formatCurrency(discount)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-900">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              Thông tin giao hàng
            </h2>
            <div className="space-y-1 text-sm text-slate-600">
              <p>
                {order.customerName}
                <br />
                {order.customerPhone}
                <br />
                {order.shippingAddress || "Chưa cập nhật địa chỉ"}
              </p>
              {order.note && (
                <p className="mt-3">
                  <span className="font-semibold text-slate-800">
                    Ghi chú:
                  </span>{" "}
                  <span>{order.note}</span>
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              Thanh toán
            </h2>
            <p className="text-sm text-slate-600">
              Phương thức:{" "}
              <span className="font-semibold text-slate-900">
                {paymentMethodText}
              </span>
            </p>
            <p className="text-sm text-slate-600">
              Trạng thái:{" "}
              <span className="font-semibold text-slate-900">
                {order.paymentStatus}
              </span>
            </p>
            {order.transactionId && (
              <p className="text-sm text-slate-600">
                Mã giao dịch:{" "}
                <span className="font-semibold text-slate-900">
                  {order.transactionId}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => router.push("/orders")}
        >
          Quay lại đơn hàng
        </Button>
      </div>
    </div>
  );
}

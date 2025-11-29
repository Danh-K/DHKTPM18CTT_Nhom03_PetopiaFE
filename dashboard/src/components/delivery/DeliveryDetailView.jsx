"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeliveryById } from "../../store/deliverySlice";
import {
  HiOutlineArrowLeft,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineCheckCircle,
  HiOutlineHome,
  HiOutlineArchiveBox,
  HiOutlineTruck,
} from "react-icons/hi2";

export default function DeliveryDetailView({ deliveryId, onBack }) {
  const dispatch = useDispatch();
  const { selectedDelivery: d, loading } = useSelector(
    (state) => state.delivery
  );

  useEffect(() => {
    if (deliveryId) dispatch(fetchDeliveryById(deliveryId));
  }, [deliveryId, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
      </div>
    );
  }

  if (!d) {
    return (
      <div className="text-center py-20 text-red-600 text-xl">
        Không tìm thấy đơn hàng
        <button
          onClick={onBack}
          className="block mx-auto mt-4 px-6 py-3 bg-orange-600 text-white rounded-lg"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  const steps = [
    {
      status: "Chuẩn bị",
      title: "Đơn hàng đã được tạo",
      desc: "Đơn hàng đã được xác nhận và chấp thuận",
      icon: HiOutlineHome,
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-500",
    },
    {
      status: "Đã đóng gói",
      title: "Đã chuẩn bị hàng",
      desc: "Hàng hóa đã được đóng gói và sẵn sàng vận chuyển",
      icon: HiOutlineArchiveBox,
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-500",
    },
    {
      status: "Đang giao",
      title: "Đang giao",
      desc: "Đơn hàng đang được vận chuyển",
      icon: HiOutlineTruck,
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-500",
    },
    {
      status: "Đã giao hàng",
      title: "Đã giao hàng",
      desc: "Giao hàng thành công",
      icon: HiOutlineCheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
  ];

  const statusMap = {
    PREPARING: 0,
    SHIPPED: 1,
    IN_TRANSIT: 2,
    DELIVERED: 3,
    "Chuẩn bị": 0,
    "Đã đóng gói": 1,
    "Đang giao": 2,
    "Đã giao hàng": 3,
  };

  const currentIndex = statusMap[d.currentStatus] ?? -1;
  const isDelivered = currentIndex === 3;

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const getLatestEvent = (status) => {
    const event = d.timeline
      .slice()
      .reverse()
      .find((e) => e.status === status);
    return event
      ? {
          time: formatDate(event.updatedAt),
          location: event.location,
        }
      : null;
  };

  const getValueShippingMethod = (method) => {
    const map = {
      STANDARD: "Tiêu chuẩn",
      EXPRESS: "Nhanh chóng",
      SAME_DAY: "Trong ngày",
    };
    return map[method] || "Không rõ";
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 hover:bg-blue-100 dark:hover:bg-blue-600 hover:text-white rounded-full transition"
          >
            <HiOutlineArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Chi tiết giao hàng</h1>
            <p className="text-2xl text-gray-500">
              Mã vận chuyển: {d.trackingNumber}
            </p>
          </div>
        </div>

        {/* Nút trạng thái cố định góc phải */}
        <div
          className={`px-8 py-3 rounded-full text-white font-bold text-lg shadow-lg ${
            isDelivered ? "bg-green-600" : "bg-orange-600"
          }`}
        >
          {d.currentStatus}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-3 gap-8">
        {/* === 4 BƯỚC CỐ ĐỊNH === */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border p-8">
            <h2 className="text-2xl font-bold mb-10">Lịch sử giao hàng</h2>

            <div className="space-y-12">
              {steps.map((step, index) => {
                const done = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const event = getLatestEvent(step.status);
                const Icon = step.icon;

                return (
                  <div key={index} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all ${
                          done
                            ? `${step.bg} ${step.border} ${step.color}`
                            : "bg-gray-100 border-gray-300 text-gray-400"
                        } ${
                          isCurrent
                            ? "animate-pulse ring-4 ring-orange-300"
                            : ""
                        }`}
                      >
                        {done ? (
                          <Icon className="w-8 h-8" />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full" />
                        )}
                      </div>
                      {index < 3 && (
                        <div
                          className={`w-0.5 h-20 mt-4 ${
                            done ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      )}
                    </div>

                    {/* Nội dung */}
                    <div className="flex-1">
                      <h3
                        className={`text-xl font-bold ${
                          done ? step.color : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-lg mt-1">{step.desc}</p>
                      {event && (
                        <>
                          {event.location && (
                            <p className="text-2sm text-gray-500 mt-2 flex items-center gap-2">
                              <HiOutlineMapPin className="w-4 h-4" />
                              {event.location}
                            </p>
                          )}
                          <p className="text-2sm text-gray-500 mt-2">
                            Lúc {event.time}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* === PHẦN PHẢI – THÔNG TIN === */}
        <div className="space-y-6">
          {/* Khách hàng */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border p-6">
            <h3 className="font-bold text-2xl mb-4">Thông tin khách hàng</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <HiOutlineUser className="w-10 h-10 text-orange-600" />
                <div>
                  <p className="text-lg text-gray-500">Tên khách hàng</p>
                  <p className="font-medium text-lg">{d.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlinePhone className="w-10 h-10 text-orange-600" />
                <div>
                  <p className="text-lg text-gray-500">Số điện thoại</p>
                  <p className="font-medium text-lg">{d.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border p-6">
            <h3 className="font-bold text-2xl mb-4">Địa chỉ giao hàng</h3>
            <p className="text-gray-700 flex items-center gap-3">
              <HiOutlineMapPin className="w-10 h-10 text-orange-600 mt-0.5 flex-shrink-0" />
              <span className="text-lg">{d.deliveryAddress}</span>
            </p>
          </div>

          {/* Đơn hàng */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border p-6">
            <h3 className="font-bold text-2xl mb-4">Thông tin đơn hàng</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-lg">Mã đơn hàng</span>
                <span className="font-medium text-lg">{d.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg">Số sản phẩm</span>
                <span className="font-medium text-lg">{d.itemCount} sản phẩm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg">Phí vận chuyển</span>
                <span className="font-medium text-lg">
                  ₫ {d.shippingFee.toLocaleString()}
                </span>
              </div>

              <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700 my-4" />

              <div className="-mx-6 px-6 py-3 bg-orange-100/40">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    Tổng tiền
                  </span>
                  <span className="text-2xl font-bold text-orange-700">
                    ₫ {d.totalAmount.toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Thông tin vận chuyển */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border p-6">
            <h3 className="font-bold text-2xl mb-4">Thông tin vận chuyển</h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-lg">Phương thức vận chuyển</span>
                <span className="font-medium text-lg">
                    {getValueShippingMethod(d.shippingMethod)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg">Ngày tạo đơn</span>
                <span className="font-medium text-lg">{formatDate(d.createdAt)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-lg">Ngày dự kiến giao</span>
                <span className="font-medium text-lg">
                  {formatDate(d.estimatedDeliveryDate)}
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

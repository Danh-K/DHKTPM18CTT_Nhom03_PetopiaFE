"use client"

import DeliveryTimeline from "./DeliveryTimeLine"
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineArchiveBox } from "react-icons/hi2"

export default function DeliveryCard({ delivery, darkMode = false }) {
  const defaults = {
    currentStatus: "Chuẩn bị",
    trackingNumber: "N/A",
    customerName: "Chưa rõ",
    customerPhone: "N/A",
    deliveryAddress: "Chưa có địa chỉ",
    totalAmount: 0,
    itemCount: 0,
    timeline: [],
  }

  const { currentStatus, trackingNumber, customerPhone, deliveryAddress, totalAmount, itemCount, timeline } = {
    ...defaults,
    ...delivery,
  }

  const statusColors = {
    "Chuẩn bị": "bg-blue-100 text-blue-800",
    "Đã đóng gói": "bg-purple-100 text-purple-800",
    "Đang giao": "bg-orange-100 text-orange-800",
    "Đã giao hàng": "bg-green-100 text-green-800",
    "Đã trả hàng": "bg-red-100 text-red-800",
    "Giao hàng thất bại": "bg-red-200 text-red-900",
  }

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        darkMode
          ? "bg-gray-800 border-gray-700 hover:border-orange-600 shadow-lg"
          : "bg-white border-gray-200 hover:border-orange-600 shadow-md hover:shadow-lg"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[currentStatus] || "bg-gray-100 text-gray-800"}`}
            >
              {currentStatus}
            </span>
          </div>
          <h3 className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-900"}`}>Mã: {trackingNumber}</h3>
        </div>
        {/* Customer Name */}
        <div className="flex gap-2">
          <HiOutlineArchiveBox className="w-5 h-5 flex-shrink-0 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <p className={`text-xs font-semibold opacity-70 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Khách hàng
            </p>
            <p className={`text-xs font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              {delivery.customerName}
            </p>
          </div>
        </div>
      </div>

      <div className={`-mx-4 px-4 mb-3 pb-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <DeliveryTimeline currentStatus={currentStatus} />
        </div>

      <div className="space-y-2 mb-3">
        {/* Address */}
        <div className="flex gap-2">
          <HiOutlineMapPin className="w-5 h-5 flex-shrink-0 text-orange-600 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold opacity-70 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Giao đến
            </p>
            <p className={`text-xs font-medium line-clamp-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              {deliveryAddress}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex gap-2">
          <HiOutlinePhone className="w-5 h-5 flex-shrink-0 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <p className={`text-xs font-semibold opacity-70 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Liên hệ
            </p>
            <p className={`text-xs font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{customerPhone}</p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div
        className={`flex justify-between items-center pt-2 border-t text-xs ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="flex items-center gap-1">
          <HiOutlineArchiveBox className="w-4 h-4 text-orange-600" />
          <span className={darkMode ? "text-gray-300" : "text-gray-600"}>{itemCount} sản phẩm</span>
        </div>
        <span className="font-bold text-orange-600">₫ {totalAmount.toLocaleString("vi-VN")}</span>
      </div>
    </div>
  )
}

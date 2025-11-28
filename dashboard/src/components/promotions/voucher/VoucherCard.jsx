"use client";

import { useState } from "react";
import { HiDuplicate, HiPencil, HiTrash, HiClipboardCopy, HiCheck } from "react-icons/hi";

export default function VoucherCard({
  voucher,
  darkMode,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onImageClick,
}) {

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className={`rounded-xl overflow-hidden border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"} shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group`}>
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={onImageClick}>
        <img src={voucher.image || "/placeholder.svg"} alt={voucher.code} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-semibold bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">Xem ảnh</span>
        </div>

        {voucher.discountValue && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
              {voucher.discountType === "PERCENTAGE" ? `${voucher.discountValue}%` : `${(voucher.discountValue / 1000).toFixed(0)}K`}
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <button
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
              voucher.status === "ACTIVE" ? "bg-green-500 hover:bg-green-600 text-white" :
              voucher.status === "INACTIVE" ? "bg-red-500 text-white" : "bg-gray-500 text-white"
            }`}
            disabled={voucher.status === "INACTIVE"}
          >
            {voucher.status === "ACTIVE" ? "Hoạt động" : voucher.status === "INACTIVE" ? "Tạm dừng" : "Hết hạn"}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-[#7b4f35] truncate">{voucher.code}</h3>
          <button onClick={handleCopy} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Sao chép mã">
            {copied ? (
              <HiCheck className="w-5 h-5 text-green-500" />
            ) : (
              <HiClipboardCopy className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-800 mb-3 line-clamp-2">{voucher.description}</p>
        <div className="text-sm text-blue-500 mb-4 font-semibold">
          {new Date(voucher.startDate).toLocaleDateString("vi-VN")} - {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
        </div>
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-gray-500">Đã dùng:</span>
          <span className="font-semibold">{voucher.usedCount} / {voucher.maxUsage}</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onView} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm" title="Chi tiết">Chi tiết</button>
          <button onClick={onDuplicate} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg" title="Nhân bản"><HiDuplicate className="h-5 w-5" /></button>
          <button onClick={onEdit} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="Chỉnh sửa"><HiPencil className="h-5 w-5" /></button>
          {voucher.status !== "INACTIVE" && (
            <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Vô hiệu hóa"><HiTrash className="h-5 w-5" /></button>
          )}
        </div>
      </div>
    </div>
  );
}
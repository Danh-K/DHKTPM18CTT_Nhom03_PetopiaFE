"use client";

import { HiDuplicate, HiPencil, HiTrash, HiClipboardCopy } from "react-icons/hi";

export default function VoucherCard({
  voucher,
  darkMode,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onImageClick,
}) {
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
              {voucher.discountType === "percentage" ? `${voucher.discountValue}%` : `${(voucher.discountValue / 1000).toFixed(0)}K`}
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
              voucher.status === "active" ? "bg-green-500 hover:bg-green-600 text-white" :
              voucher.status === "inactive" ? "bg-red-500 text-white" : "bg-gray-500 text-white"
            }`}
            disabled={voucher.status === "expired"}
          >
            {voucher.status === "active" ? "Hoạt động" : voucher.status === "inactive" ? "Tạm dừng" : "Hết hạn"}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-[#7b4f35] truncate">{voucher.code}</h3>
          <button onClick={() => navigator.clipboard.writeText(voucher.code)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <HiClipboardCopy className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{voucher.description}</p>
        <div className="text-xs text-gray-500 mb-4">
          {new Date(voucher.startDate).toLocaleDateString("vi-VN")} - {new Date(voucher.endDate).toLocaleDateString("vi-VN")}
        </div>
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-gray-500">Đã dùng:</span>
          <span className="font-semibold">{voucher.usedCount} / {voucher.usageLimit}</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onView} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Chi tiết</button>
          <button onClick={onDuplicate} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"><HiDuplicate className="h-5 w-5" /></button>
          <button onClick={onEdit} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"><HiPencil className="h-5 w-5" /></button>
          <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><HiTrash className="h-5 w-5" /></button>
        </div>
      </div>
    </div>
  );
}
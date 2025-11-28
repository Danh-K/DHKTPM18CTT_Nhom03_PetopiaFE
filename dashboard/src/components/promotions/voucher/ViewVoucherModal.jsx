"use client"

import { HiX } from "react-icons/hi"

export default function ViewVoucherModal({ darkMode, voucher, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="bg-[#7b4f35] text-white p-6 flex items-center justify-between rounded-t-xl">
          <h3 className="text-2xl font-bold">Chi tiết Voucher</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#6a4330] rounded-lg transition-colors">
            <HiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Mã Voucher</p>
              <p className="font-mono font-bold text-[#7b4f35] text-lg">{voucher.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  voucher.status === "active"
                    ? "bg-green-100 text-green-800"
                    : voucher.status === "expired"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {voucher.status === "active"
                  ? "Hoạt động"
                  : voucher.status === "expired"
                    ? "Hết hạn"
                    : "Không hoạt động"}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Mô tả</p>
            <p className="text-base">{voucher.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Loại giảm giá</p>
              <p className="text-base font-medium">{voucher.discountType === "percentage" ? "Phần trăm" : "Cố định"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Giá trị giảm</p>
              <p className="text-base font-bold text-[#7b4f35]">
                {voucher.discountType === "percentage"
                  ? `${voucher.discountValue}%`
                  : `${voucher.discountValue.toLocaleString()}đ`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Giá trị đơn hàng tối thiểu</p>
              <p className="text-base">
                {voucher.minOrderValue ? `${voucher.minOrderValue.toLocaleString()}đ` : "Không giới hạn"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Giảm tối đa</p>
              <p className="text-base">
                {voucher.maxDiscount ? `${voucher.maxDiscount.toLocaleString()}đ` : "Không giới hạn"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày bắt đầu</p>
              <p className="text-base">{voucher.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày kết thúc</p>
              <p className="text-base">{voucher.endDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Số lượng sử dụng</p>
              <p className="text-base">
                {voucher.usedCount} / {voucher.usageLimit}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Còn lại</p>
              <p className="text-base font-bold text-green-600">{voucher.usageLimit - voucher.usedCount}</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-[#7b4f35] text-white rounded-lg hover:bg-[#6a4330] transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
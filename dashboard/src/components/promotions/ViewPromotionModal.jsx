"use client";

import { HiX } from "react-icons/hi";

export default function ViewPromotionModal({ darkMode, promotion, onClose }) {
  if (!promotion) return null;

  const getPromotionTypeLabel = (type) => {
    switch (type?.toUpperCase()) {
      case "DISCOUNT":   return "Giảm giá";
      case "FREESHIP":   return "Miễn phí vận chuyển";
      case "CASHBACK":   return "Hoàn tiền";
      case "BUNDLE":     return "Combo / Mua kèm";
      default:           return type || "Không xác định";
    }
  };

  const formatDiscountValue = () => {
    if (!promotion.discountValue) return "—";
    return promotion.promotionType === "DISCOUNT"
      ? `${promotion.discountValue}%`
      : `${Number(promotion.discountValue).toLocaleString("vi-VN")}đ`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="bg-[#7b4f35] text-white p-6 flex items-center justify-between rounded-t-xl">
          <h3 className="text-2xl font-bold">Chi tiết Khuyến mãi</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#6a4330] rounded-lg transition-colors">
            <HiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Mã khuyến mãi</p>
              <p className="font-bold text-[#7b4f35] text-lg">{promotion.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  promotion.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : promotion.status === "INACTIVE"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {promotion.status === "ACTIVE" ? "Hoạt động" : 
                 promotion.status === "INACTIVE" ? "Không hoạt động" : "Hết hạn"}
              </span>
            </div>
          </div>

          {promotion.description && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Mô tả</p>
              <p className="text-base">{promotion.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Loại khuyến mãi</p>
              <p className="text-base font-medium">
                {getPromotionTypeLabel(promotion.promotionType)}
              </p>
            </div>
            {promotion.discountValue && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Giá trị giảm</p>
                <p className="text-base font-bold text-[#7b4f35]">
                  {formatDiscountValue()}
                </p>
              </div>
            )}
          </div>

          {promotion.minOrderAmount > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Đơn hàng tối thiểu</p>
              <p className="text-base font-medium">
                {Number(promotion.minOrderAmount).toLocaleString("vi-VN")}đ
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày bắt đầu</p>
              <p className="text-base">
                {new Date(promotion.startDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày kết thúc</p>
              <p className="text-base">
                {new Date(promotion.endDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Đã sử dụng</p>
              <p className="text-base font-medium">{promotion.usedCount || 0} lần</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Giới hạn sử dụng</p>
              <p className="text-base font-medium">
                {promotion.maxUsage ? `${promotion.maxUsage} lần` : "Không giới hạn"}
              </p>
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
  );
}
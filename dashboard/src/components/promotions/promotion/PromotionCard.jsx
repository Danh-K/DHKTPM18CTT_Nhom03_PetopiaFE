import { HiDuplicate, HiPencil, HiTrash } from "react-icons/hi";

export default function PromotionCard({
  promotion,
  darkMode,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onImageClick,
}) {
  return (
    <div
      className={`rounded-xl overflow-hidden ${
        darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"
      } border shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group`}
    >
      <div
        className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden cursor-pointer"
        onClick={() => onImageClick(promotion)}
      >
        <img
          src={promotion.image || "/placeholder.svg"}
          alt={promotion.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-semibold bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
            Xem ảnh
          </span>
        </div>

        {promotion.discountValue && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
              {promotion.discountType === "percentage" ||
              promotion.discountType === "discount"
                ? `${promotion.discountValue}%`
                : `${(promotion.discountValue / 1000).toFixed(0)}K`}
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(promotion.id);
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
              promotion.status === "active"
                ? "bg-green-500 hover:bg-green-600 text-white"
                : promotion.status === "expired"
                ? "bg-red-500 text-white cursor-not-allowed"
                : "bg-gray-500 hover:bg-gray-600 text-white"
            }`}
            disabled={promotion.status === "expired"}
          >
            {promotion.status === "active"
              ? "Hoạt động"
              : promotion.status === "expired"
              ? "Hết hạn"
              : "Tạm dừng"}
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-[#7b4f35] mb-2 truncate">
          {promotion.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {promotion.description}
        </p>
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-gray-500">Danh mục:</span>
          <span className="font-semibold truncate ml-2 text-[#7b4f35]">
            {promotion.categoryName}
          </span>
        </div>
        <div className="text-xs text-gray-500 mb-4">
          {new Date(promotion.startDate).toLocaleDateString("vi-VN")} -{" "}
          {new Date(promotion.endDate).toLocaleDateString("vi-VN")}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(promotion)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Chi tiết
          </button>
          <button
            onClick={() => onDuplicate(promotion)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
            title="Nhân bản"
          >
            <HiDuplicate className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEdit(promotion)}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
            title="Sửa"
          >
            <HiPencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(promotion.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Xóa"
          >
            <HiTrash className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

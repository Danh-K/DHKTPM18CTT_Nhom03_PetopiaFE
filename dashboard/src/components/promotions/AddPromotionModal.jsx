"use client";

import { useState } from "react";
import { HiX, HiUpload, HiCalendar } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { addPromotion } from "../../store/promotionSlice";
import { uploadToCloudinary } from "../../api/cloudinaryService";
import toast from "react-hot-toast";

const categories = [
  { id: null, name: "Tất cả danh mục" },
  { id: "C001", name: "Chó" },
  { id: "C002", name: "Mèo" },
  { id: "C003", name: "Poodle" },
  { id: "C004", name: "Golden Retriever" },
  { id: "C005", name: "Husky" },
  { id: "C006", name: "Mèo Ba Tư" },
  { id: "C007", name: "Mèo Anh Lông Ngắn" },
  { id: "C008", name: "Mèo Xiêm" },
  { id: "C009", name: "Chihuahua" },
  { id: "C010", name: "Mèo Ragdoll" },
];

export default function AddPromotionModal({ darkMode, onClose }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Tự động điền hôm nay và 7 ngày sau
  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    promotionType: "DISCOUNT",
    discountValue: "",
    minOrderAmount: "",
    maxUsage: "",
    categoryId: null,
    startDate: today,
    endDate: nextWeek,
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast.error("Vui lòng nhập mã khuyến mãi!");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        toast.loading("Đang tải ảnh lên...");
        imageUrl = await uploadToCloudinary(imageFile);
        toast.dismiss();
      }

      const payload = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim() || null,
        promotionType: formData.promotionType,
        discountValue: formData.discountValue ? Number(formData.discountValue) : null,
        minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : null,
        maxUsage: formData.maxUsage ? Number(formData.maxUsage) : null,
        categoryId: formData.categoryId || null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        imageUrl: imageUrl || null,
      };

      await dispatch(addPromotion(payload)).unwrap();
      toast.success("Thêm khuyến mãi thành công!");
      onClose();
    } catch (err) {
      toast.error("Thêm thất bại! Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        {/* Header */}
        <div className="sticky top-0 bg-[#7b4f35] text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-2xl font-bold">Thêm Khuyến Mãi Mới</h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-[#6a4330 rounded-lg transition"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Upload ảnh */}
          <div>
            <label className="block text-sm font-medium mb-3">Hình ảnh khuyến mãi</label>
            <div className="flex gap-6 items-start">
              <label className={`flex-1 h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer ${darkMode ? "bg-gray-700 border-gray-600 hover:border-gray-500" : "bg-gray-50 hover:border-[#7b4f35"}`}>
                <HiUpload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click để tải ảnh lên</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={loading} />
              </label>
              {imagePreview && (
                <div className="w-48 h-48 rounded-xl overflow-hidden border-4 border-[#7b4f35] shadow-lg">
                  <img src={imagePreview} alt="Xem trước" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mã khuyến mãi */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-2">Mã khuyến mãi *</label>
              <input
                required
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-gray-700" : "bg-white"} focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                placeholder="VD: FLASH2025"
              />
            </div>

            {/* Mô tả */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-2">Mô tả</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-gray-700" : "bg-white"} focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                placeholder="Mô tả chương trình khuyến mãi"
              />
            </div>

            {/* Loại khuyến mãi */}
            <div>
              <label className="block font-medium mb-2">Loại khuyến mãi *</label>
              <select
                value={formData.promotionType}
                onChange={(e) => setFormData({ ...formData, promotionType: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-gray-700" : "bg-white"} focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
              >
                <option value="DISCOUNT">Giảm giá</option>
                <option value="FREESHIP">Miễn phí vận chuyển</option>
                <option value="CASHBACK">Hoàn tiền</option>
                <option value="BUNDLE">Combo</option>
              </select>
            </div>

            {/* Giá trị khuyến mãi */}
            <div>
              <label className="block font-medium mb-2">
                Giá trị{" "}
                {formData.promotionType === "DISCOUNT" && "giảm (%)"}
                {formData.promotionType === "FREESHIP" && "miễn phí vận chuyển (VNĐ)"}
                {formData.promotionType === "CASHBACK" && "hoàn tiền (VNĐ)"}
                {formData.promotionType === "BUNDLE" && "giảm giá combo (VNĐ)"}
                {formData.promotionType === "DISCOUNT" && " *"}
              </label>
              <input
                type="number"
                min="0"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-gray-700" : "bg-white"} focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                placeholder={formData.promotionType === "DISCOUNT" ? "VD: 30" : "VD: 50000"}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.promotionType === "DISCOUNT" ? "Bắt buộc nhập" : "Tùy chọn"}
              </p>
            </div>

            {/* Các field khác */}
            <div>
              <label className="block font-medium mb-2">Đơn tối thiểu (VNĐ)</label>
              <input
                type="number"
                min="0"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-gray-700" : "bg-white"} focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Giới hạn sử dụng</label>
              <input
                type="number"
                min="1"
                value={formData.maxUsage}
                onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-gray-700" : "bg-white"} focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                placeholder="Ví dụ: 100"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Ngày bắt đầu *</label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className={`w-full px-4 py-3 pr-10 rounded-lg border ${darkMode ? "bg-gray-700" : "bg-white"} focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                />
                <HiCalendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Ngày kết thúc *</label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className={`w-full px-4 py-3 pr-10 rounded-lg border ${darkMode ? "bg-gray-700" : "bg-white"} focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                />
                <HiCalendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
              <label className="block font-medium mb-2">Danh mục áp dụng</label>
              <select
                value={formData.categoryId || ""}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || null })}
                className={`w-full px-4 py-3 rounded-lg border ${darkMode ? "bg-gray-700" : "bg-white"} focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
              >
                {categories.map((c) => (
                  <option key={c.id || "all"} value={c.id || ""}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

          {/* Nút bấm */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#7b4f35] text-white rounded-lg hover:bg-[#6a4330] disabled:opacity-70 transition font-medium"
            >
              {loading ? "Đang thêm..." : "Thêm khuyến mãi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
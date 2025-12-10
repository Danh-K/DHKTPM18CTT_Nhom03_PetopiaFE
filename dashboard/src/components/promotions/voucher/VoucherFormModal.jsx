"use client";

import { useEffect, useState } from "react";
import { HiX, HiUpload, HiCalendar } from "react-icons/hi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addVoucher, updateVoucher } from "../../../store/voucherSlice";
import { uploadToCloudinary } from "../../../api/cloudinaryService";

export default function VoucherFormModal({
  darkMode,
  onClose,
  voucher = null,
}) {
  const dispatch = useDispatch();
  const isEdit = !!voucher?.voucherId;

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(voucher?.image || null);
  const [imageFile, setImageFile] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [formData, setFormData] = useState({
    voucherId: voucher?.voucherId || null,
    code: voucher?.code || "",
    description: voucher?.description || "",
    discountType:
      voucher?.discountType === "PERCENTAGE"
        ? "percentage"
        : "fixed" || "percentage",
    discountValue: voucher?.discountValue || "",
    minOrderAmount: voucher?.minOrderAmount || "",
    maxUsage: voucher?.maxUsage || "",
    startDate: voucher?.startDate || today,
    endDate: voucher?.endDate || nextWeek,
    imageUrl: voucher?.imageUrl || null,
    status: voucher?.status || "ACTIVE",
  });

  // Khi mở modal edit → load ảnh preview
  useEffect(() => {
    if (voucher?.imageUrl) setImagePreview(voucher.imageUrl);
  }, [voucher]);

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
      toast.error("Vui lòng nhập mã voucher!");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        toast.loading("Đang tải ảnh lên Cloudinary...");
        try {
          imageUrl = await uploadToCloudinary(imageFile);
          toast.dismiss();
          toast.success("Tải ảnh thành công!");
        } catch (err) {
          toast.dismiss();
          toast.error("Lỗi tải ảnh!");
          setLoading(false);
          return;
        }
      }

      const payload = {
        ...formData,
        voucherId: isEdit ? formData.voucherId : null,
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim() || null,
        discountType:
          formData.discountType === "percentage"
            ? "PERCENTAGE"
            : "FIXED_AMOUNT",
        discountValue: formData.discountValue
          ? Number(formData.discountValue)
          : null,
        minOrderAmount: formData.minOrderAmount
          ? Number(formData.minOrderAmount)
          : null,
        maxUsage: formData.maxUsage ? Number(formData.maxUsage) : null,
        imageUrl: imageUrl || null,
        status: isEdit ? (formData.status === "ACTIVE" ? "ACTIVE" : "INACTIVE") : "ACTIVE",
      };

      if (isEdit) {
        await dispatch(updateVoucher(payload)).unwrap();
        toast.success("Cập nhật voucher thành công!");
      } else {
        await dispatch(addVoucher(payload)).unwrap();
        toast.success("Thêm voucher thành công!");
      }
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || "";
      if (
        msg.includes("already exists") ||
        msg.includes("Duplicate entry") ||
        msg.includes("code")
      ) {
        toast.error("Mã voucher đã tồn tại! Vui lòng chọn mã khác.");
      } else {
        toast.error(isEdit ? "Cập nhật thất bại!" : "Thêm thất bại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-2 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#7b4f35] text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-2xl font-bold">
            {isEdit ? "Chỉnh sửa Voucher" : "Thêm Voucher Mới"}
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-[#6a4330] rounded-lg transition"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Upload ảnh */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Hình ảnh Voucher
            </label>
            <div className="flex gap-6 items-start">
              <label
                className={`flex-1 h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 hover:border-gray-500"
                    : "bg-gray-50 hover:border-[#7b4f35]"
                }`}
              >
                <HiUpload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Click để {isEdit ? "thay đổi" : "tải"} ảnh
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </label>

              {imagePreview && (
                <div className="w-48 h-48 rounded-xl overflow-hidden border-4 border-[#7b4f35] shadow-lg">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mã voucher */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-2">Mã Voucher *</label>
              <input
                required
                type="text"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                placeholder="VD: SUMMER2025"
              />
            </div>

            {/* Mô tả */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-2">Mô tả</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                placeholder="Mô tả chi tiết về voucher"
              />
            </div>

            {/* Loại giảm giá */}
            <div>
              <label className="block font-medium mb-2">Loại giảm giá *</label>
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({ ...formData, discountType: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
              >
                <option value="percentage">Phần trăm (%)</option>
                <option value="fixed">Cố định (VNĐ)</option>
              </select>
            </div>

            {/* Giá trị giảm */}
            <div>
              <label className="block font-medium mb-2">
                Giá trị giảm{" "}
                {formData.discountType === "percentage" ? "(%)" : "(VNĐ)"} *
              </label>
              <input
                required
                type="number"
                min="0"
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({ ...formData, discountValue: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                placeholder={
                  formData.discountType === "percentage" ? "20" : "50000"
                }
              />
            </div>

            {/* Đơn tối thiểu */}
            <div>
              <label className="block font-medium mb-2">
                Đơn hàng tối thiểu (VNĐ)
              </label>
              <input
                type="number"
                min="0"
                value={formData.minOrderAmount}
                onChange={(e) =>
                  setFormData({ ...formData, minOrderAmount: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                placeholder="100000"
              />
            </div>

            {/* Số lượng sử dụng */}
            <div>
              <label className="block font-medium mb-2">
                Giới hạn sử dụng *
              </label>
              <input
                required
                type="number"
                min="1"
                value={formData.maxUsage}
                onChange={(e) =>
                  setFormData({ ...formData, maxUsage: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                placeholder="100"
              />
            </div>

            {/* Ngày bắt đầu */}
            <div>
              <label className="block font-medium mb-2">Ngày bắt đầu *</label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  } focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                />
                <HiCalendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Ngày kết thúc */}
            <div>
              <label className="block font-medium mb-2">Ngày kết thúc *</label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  } focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                />
                <HiCalendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Trạng thái – chỉ hiện khi edit */}
            {isEdit && (
              <div>
                <label className="block font-medium mb-2">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    darkMode ? "bg-gray-700" : "bg-white"
                  } focus:ring-2 focus:ring-[#7b4f35] focus:outline-none`}
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Tạm dừng</option>
                </select>
              </div>
            )}
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
              {loading
                ? "Đang lưu..."
                : isEdit
                ? "Cập nhật Voucher"
                : "Thêm Voucher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

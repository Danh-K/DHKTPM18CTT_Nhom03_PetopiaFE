"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css";

import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronDown,
  HiChevronUp,
  HiX,
  HiFilter,
  HiOutlineCube,
  HiSearch,
  HiPhotograph,
  HiInformationCircle,
  HiEye,
  HiOutlineExclamation,
  HiUpload,
  HiStar,
  HiCheck,
} from "react-icons/hi";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStethoscope,
  FaSyringe,
  FaWeight,
  FaRulerVertical,
  FaPaw,
  FaPalette,
} from "react-icons/fa";

import { usePetManagement } from "../../hooks/usePetManagement";

// --- HELPERS ---
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

const transformGoogleDriveUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  if (url.includes("drive.google.com")) {
    const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1])
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }
  return url;
};

const getPetThumbnail = (images) => {
  if (!images || images.length === 0)
    return "https://placehold.co/150x150?text=No+Image";
  const imgObj = images.find((i) => i.is_thumbnail) || images[0];
  return (
    transformGoogleDriveUrl(imgObj?.image_url) ||
    "https://placehold.co/150x150?text=No+Image"
  );
};

const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val
  );

// --- FORM COMPONENT (CÓ VALIDATION UI) ---
const PetForm = ({ initialData, onDataChange, categories, errors = {} }) => {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onDataChange((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn file từ máy tính
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        image_id: null,
        image_url: URL.createObjectURL(file),
        file: file,
        is_thumbnail: false,
        is_existing: false,
      }));

      if (
        (!initialData.images || initialData.images.length === 0) &&
        newImages.length > 0
      ) {
        newImages[0].is_thumbnail = true;
      }

      onDataChange((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }));
    }
  };

  const handleSetThumbnail = (index) => {
    const newImages = initialData.images.map((img, i) => ({
      ...img,
      is_thumbnail: i === index,
    }));
    onDataChange((prev) => ({ ...prev, images: newImages }));
  };

  const handleRemoveImage = (index) => {
    const newImages = initialData.images.filter((_, i) => i !== index);
    if (newImages.length > 0 && !newImages.some((img) => img.is_thumbnail)) {
      newImages[0].is_thumbnail = true;
    }
    onDataChange((prev) => ({ ...prev, images: newImages }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm">
      {/* Cột Trái */}
      <div className="md:col-span-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-bold text-gray-700 mb-2">
              Tên thú cưng <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="name"
              value={initialData.name || ""}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
              } rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-colors`}
              placeholder="Nhập tên thú cưng..."
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-2">
              Phân loại <span className="text-red-500">*</span>
            </label>
            <select
              name="category_id"
              value={initialData.category_id || ""}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.category_id
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              } rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm cursor-pointer`}
            >
              <option value="">-- Chọn loại --</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-2">
            Mô tả chi tiết
          </label>
          <textarea
            name="description"
            value={initialData.description || ""}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-sm"
            placeholder="Mô tả về tính cách, nguồn gốc, đặc điểm..."
          ></textarea>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block font-bold text-gray-700 mb-2">
              Giá bán (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={initialData.price || 0}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.price ? "border-red-500 bg-red-50" : "border-gray-300"
              } rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm`}
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-2">
              Giá giảm (VNĐ)
            </label>
            <input
              type="number"
              name="discount_price"
              value={initialData.discount_price || 0}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.discount_price
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              } rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm`}
            />
            {errors.discount_price && (
              <p className="text-xs text-red-500 mt-1">
                {errors.discount_price}
              </p>
            )}
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-2">
              Tồn kho <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock_quantity"
              value={initialData.stock_quantity || 0}
              onChange={handleChange}
              className={`w-full p-3 border ${
                errors.stock_quantity
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              } rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm`}
            />
            {errors.stock_quantity && (
              <p className="text-xs text-red-500 mt-1">
                {errors.stock_quantity}
              </p>
            )}
          </div>
        </div>

        {/* QUẢN LÝ ẢNH */}
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-300">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <label className="block text-lg font-bold text-gray-800 flex items-center gap-2">
                <HiPhotograph className="text-blue-600" /> Thư viện ảnh
              </label>
              <span className="text-xs text-gray-500 mt-1">
                Định dạng: JPG, PNG. Tối đa 5MB/ảnh.
              </span>
            </div>
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <HiUpload className="text-lg" /> Tải ảnh lên
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {initialData.images?.map((img, idx) => (
              <div
                key={idx}
                className={`relative group aspect-square bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 ${
                  img.is_thumbnail
                    ? "ring-4 ring-blue-500 ring-offset-2"
                    : "hover:shadow-xl"
                }`}
              >
                <img
                  src={transformGoogleDriveUrl(img.image_url)}
                  alt="Pet Preview"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) =>
                    (e.target.src = "https://placehold.co/300?text=Error")
                  }
                />

                {/* Always-visible small action buttons (top-left = set thumbnail, top-right = delete) */}
                <div className="absolute top-3 left-3 z-20">
                  <button
                    type="button"
                    onClick={() => handleSetThumbnail(idx)}
                    title={
                      img.is_thumbnail ? "Đã là ảnh chính" : "Đặt làm ảnh chính"
                    }
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow transition-colors ${
                      img.is_thumbnail
                        ? "bg-yellow-400 text-white cursor-default"
                        : "bg-white text-gray-700 hover:bg-yellow-400 hover:text-white"
                    }`}
                  >
                    <HiStar size={14} />
                  </button>
                </div>

                <div className="absolute top-3 right-3 z-20">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Xóa ảnh"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-red-600 hover:bg-red-600 hover:text-white shadow transition-colors"
                  >
                    <HiTrash size={14} />
                  </button>
                </div>

                {/* Overlay Actions (Hover Effect) - giữ để desktop có trải nghiệm lớn hơn */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-3 backdrop-blur-[2px]">
                  <button
                    type="button"
                    onClick={() => handleSetThumbnail(idx)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs shadow-lg transform transition-transform hover:scale-105 ${
                      img.is_thumbnail
                        ? "bg-yellow-400 text-white cursor-default"
                        : "bg-white text-gray-700 hover:bg-yellow-400 hover:text-white"
                    }`}
                  >
                    <HiStar
                      size={16}
                      fill={img.is_thumbnail ? "currentColor" : "none"}
                    />{" "}
                    {img.is_thumbnail ? "Đã chọn" : "Đặt làm chính"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 rounded-full font-bold text-xs shadow-lg hover:bg-red-600 hover:text-white transform transition-transform hover:scale-105"
                  >
                    <HiTrash size={16} /> Xóa ảnh
                  </button>
                </div>

                {/* Badges - đẩy badge MAIN sang phải 10 để tránh chồng với nút nhỏ */}
                {img.is_thumbnail && (
                  <div className="absolute top-3 left-10 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 z-10">
                    <HiCheck size={12} /> MAIN
                  </div>
                )}
                {img.file && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md z-10">
                    NEW
                  </div>
                )}
              </div>
            ))}
            {(!initialData.images || initialData.images.length === 0) && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <HiPhotograph size={32} className="opacity-40" />
                </div>
                <span className="text-sm font-medium">Chưa có ảnh nào.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cột Phải */}
      <div className="md:col-span-4 space-y-6">
        <div className="bg-white p-5 border rounded-xl shadow-sm">
          <label className="block font-bold text-gray-700 mb-3">
            Trạng thái hiển thị
          </label>
          <select
            name="status"
            value={initialData.status || "DRAFT"}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer"
          >
            <option value="AVAILABLE">✅ Sẵn sàng bán</option>
            <option value="SOLD">❌ Đã bán hết</option>
            <option value="DRAFT">🔒 Bản nháp (Ẩn)</option>
          </select>
        </div>

        <div className="bg-white p-5 border rounded-xl shadow-sm space-y-4">
          <h4 className="font-bold text-gray-800 border-b pb-3 text-sm uppercase tracking-wider">
            Đặc điểm vật lý
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-bold block mb-1.5">
                Tuổi (tháng)
              </label>
              <input
                type="number"
                name="age"
                value={initialData.age || ""}
                onChange={handleChange}
                className={`w-full p-2.5 border ${
                  errors.age ? "border-red-500 bg-red-50" : "border-gray-300"
                } rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
              />
              {/* Thêm đoạn này để hiện chữ lỗi */}
              {errors.age && (
                <p className="text-xs text-red-500 mt-1">{errors.age}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold block mb-1.5">
                Giới tính
              </label>
              <select
                name="gender"
                value={initialData.gender || "MALE"}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="MALE">Đực</option>
                <option value="FEMALE">Cái</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold block mb-1.5">
                Nặng (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={initialData.weight || ""}
                onChange={handleChange}
                className={`w-full p-2.5 border ${
                  errors.weight ? "border-red-500 bg-red-50" : "border-gray-300"
                } rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
              />
              {/* Thêm đoạn này để hiện chữ lỗi */}
              {errors.weight && (
                <p className="text-xs text-red-500 mt-1">{errors.weight}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold block mb-1.5">
                Cao (cm)
              </label>
              <input
                type="number"
                name="height"
                value={initialData.height || ""}
                onChange={handleChange}
                className={`w-full p-2.5 border ${
                  errors.height ? "border-red-500 bg-red-50" : "border-gray-300"
                } rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
              />
              {/* Thêm đoạn này để hiện chữ lỗi */}
              {errors.height && (
                <p className="text-xs text-red-500 mt-1">{errors.height}</p>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-bold block mb-1.5">
              Màu lông
            </label>
            <input
              type="text"
              name="color"
              value={initialData.color || ""}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-bold block mb-1.5">
              Loại lông
            </label>
            <select
              name="fur_type"
              value={initialData.fur_type || "SHORT"}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="SHORT">Ngắn</option>
              <option value="LONG">Dài</option>
              <option value="CURLY">Xoăn</option>
              <option value="NONE">Không lông</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
        </div>

        <div className="bg-blue-50 p-5 border border-blue-100 rounded-xl">
          <h4 className="font-bold text-blue-800 mb-4 text-sm uppercase flex items-center gap-2">
            <FaStethoscope /> Sức khỏe & Vaccine
          </h4>
          <div className="space-y-4">
            <div>
              <label className="text-[11px] text-blue-600 uppercase font-bold mb-1.5 block">
                Tình trạng sức khỏe
              </label>
              <input
                type="text"
                name="health_status"
                value={initialData.health_status || ""}
                onChange={handleChange}
                className="w-full p-2.5 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-blue-600 uppercase font-bold mb-1.5 block">
                Lịch sử tiêm chủng
              </label>
              <textarea
                name="vaccination_history"
                value={initialData.vaccination_history || ""}
                onChange={handleChange}
                rows={3}
                className="w-full p-2.5 border border-blue-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-300 outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODALS ---

const AddPetModal = ({ onClose, categories, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: categories[0]?.category_id || "",
    age: "",
    gender: "MALE",
    price: "",
    discount_price: "",
    stock_quantity: "",
    status: "DRAFT",
    weight: "",
    height: "",
    color: "",
    fur_type: "SHORT",
    health_status: "Tốt",
    vaccination_history: "",
    images: [],
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // 1. Tên (Khớp với @NotBlank)
    if (!formData.name || !formData.name.trim())
      newErrors.name = "Tên thú cưng không được để trống !!"; // Copy y chang message BE

    // 2. Phân loại (Khớp với @NotBlank)
    if (!formData.category_id)
      newErrors.category_id = "Vui lòng chọn phân loại thú cưng";

    // 3. Giá (Khớp với @Min(1000) và @NotNull)
    // Lưu ý: formData.price có thể là chuỗi "" nếu người dùng xóa hết
    if (
      formData.price === "" ||
      formData.price === null ||
      formData.price === undefined
    ) {
      newErrors.price = "Giá bán không được để trống";
    } else if (Number(formData.price) < 1000) {
      newErrors.price = "Giá bán phải ít nhất 1.000 VNĐ";
    }

    // 4. Tồn kho (Khớp với @Min(1) và @NotNull)
    if (formData.stock_quantity === "" || formData.stock_quantity === null) {
      newErrors.stock_quantity = "Số lượng tồn kho không được để trống";
    } else if (Number(formData.stock_quantity) < 1) {
      newErrors.stock_quantity = "Số lượng tồn kho phải ít nhất là 1";
    }

    // 5. Cân nặng (Khớp với @Positive và @NotNull)
    if (formData.weight === "" || formData.weight === null) {
      newErrors.weight = "Cân nặng không được để trống";
    } else if (Number(formData.weight) <= 0) {
      newErrors.weight = "Cân nặng phải lớn hơn 0";
    }

    // 6. Chiều cao (Khớp với @Positive và @NotNull)
    if (formData.height === "" || formData.height === null) {
      newErrors.height = "Chiều cao không được để trống";
    } else if (Number(formData.height) <= 0) {
      newErrors.height = "Chiều cao phải lớn hơn 0";
    }

    // 7. Tuổi (Khớp với @Min(1) và @NotNull)
    if (formData.age === "" || formData.age === null) {
      newErrors.age = "Tuổi không được để trống";
    } else if (Number(formData.age) < 1) {
      newErrors.age = "Tuổi phải ít nhất là 1 tháng";
    }

    setErrors(newErrors);
    // Nếu không có lỗi (length === 0) thì trả về true -> Cho phép gọi API
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin nhập liệu");
      return;
    }
    const success = await onSave(formData);
    if (success) onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col"
        variants={modalVariants}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-extrabold text-gray-800">
            Thêm Thú Cưng Mới
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <HiX size={28} className="text-gray-500" />
          </button>
        </div>
        <div className="p-8 flex-1 overflow-y-auto bg-gray-50/30">
          <PetForm
            initialData={formData}
            onDataChange={setFormData}
            categories={categories}
            errors={errors}
          />
        </div>
        <div className="flex justify-end gap-4 p-6 border-t border-gray-100 bg-white z-10">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-all"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform active:scale-95"
          >
            Lưu Thú Cưng
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const EditPetModal = ({ pet, onClose, categories, onSave }) => {
  const [formData, setFormData] = useState(pet);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // 1. Tên (Khớp với @NotBlank)
    if (!formData.name || !formData.name.trim())
      newErrors.name = "Tên thú cưng không được để trống !!"; // Copy y chang message BE

    // 2. Phân loại (Khớp với @NotBlank)
    if (!formData.category_id)
      newErrors.category_id = "Vui lòng chọn phân loại thú cưng";

    // 3. Giá (Khớp với @Min(1000) và @NotNull)
    // Lưu ý: formData.price có thể là chuỗi "" nếu người dùng xóa hết
    if (
      formData.price === "" ||
      formData.price === null ||
      formData.price === undefined
    ) {
      newErrors.price = "Giá bán không được để trống";
    } else if (Number(formData.price) < 1000) {
      newErrors.price = "Giá bán phải ít nhất 1.000 VNĐ";
    }

    // 4. Tồn kho (Khớp với @Min(1) và @NotNull)
    if (formData.stock_quantity === "" || formData.stock_quantity === null) {
      newErrors.stock_quantity = "Số lượng tồn kho không được để trống";
    } else if (Number(formData.stock_quantity) < 1) {
      newErrors.stock_quantity = "Số lượng tồn kho phải ít nhất là 1";
    }

    // 5. Cân nặng (Khớp với @Positive và @NotNull)
    if (formData.weight === "" || formData.weight === null) {
      newErrors.weight = "Cân nặng không được để trống";
    } else if (Number(formData.weight) <= 0) {
      newErrors.weight = "Cân nặng phải lớn hơn 0";
    }

    // 6. Chiều cao (Khớp với @Positive và @NotNull)
    if (formData.height === "" || formData.height === null) {
      newErrors.height = "Chiều cao không được để trống";
    } else if (Number(formData.height) <= 0) {
      newErrors.height = "Chiều cao phải lớn hơn 0";
    }

    // 7. Tuổi (Khớp với @Min(1) và @NotNull)
    if (formData.age === "" || formData.age === null) {
      newErrors.age = "Tuổi không được để trống";
    } else if (Number(formData.age) < 1) {
      newErrors.age = "Tuổi phải ít nhất là 1 tháng";
    }

    setErrors(newErrors);
    // Nếu không có lỗi (length === 0) thì trả về true -> Cho phép gọi API
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const success = await onSave(formData);
    if (success) onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col"
        variants={modalVariants}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-extrabold text-gray-800">
            Cập Nhật: <span className="text-blue-600">{formData.name}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <HiX size={28} className="text-gray-500" />
          </button>
        </div>
        <div className="p-8 flex-1 overflow-y-auto bg-gray-50/30">
          <PetForm
            initialData={formData}
            onDataChange={setFormData}
            categories={categories}
            errors={errors}
          />
        </div>
        <div className="flex justify-end gap-4 p-6 border-t border-gray-100 bg-white z-10">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-all"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform active:scale-95"
          >
            Lưu Thay Đổi
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- GIỮ NGUYÊN CÁC COMPONENT CÒN LẠI NHƯ FILTER, DELETE MODAL VÀ MAIN ---
// (Copy phần FilterModal, DeleteConfirmationModal, PetsManagement từ code cũ...)
// Code dưới đây là phần còn lại để hoàn thiện file

const FilterModal = ({ onClose, filters, onApply, categories }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const handleChange = (e) =>
    setLocalFilters({ ...localFilters, [e.target.name]: e.target.value });

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full"
        variants={modalVariants}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-bold">Bộ lọc nâng cao</h2>
          <button onClick={onClose}>
            <HiX size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Khoảng giá</label>
            <select
              name="price"
              value={localFilters.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Tất cả mức giá</option>
              <option value="under-5m">Dưới 5 triệu</option>
              <option value="5m-10m">5 - 10 triệu</option>
              <option value="over-10m">Trên 10 triệu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              name="status"
              value={localFilters.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="AVAILABLE">Sẵn sàng bán</option>
              <option value="SOLD">Đã bán</option>
              <option value="DRAFT">Nháp</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-6 pt-4 border-t gap-3">
          <button
            onClick={() => {
              onApply({ ...filters, status: "", price: "" });
              onClose();
            }}
            className="px-4 py-2 bg-gray-100 rounded text-sm"
          >
            Mặc định
          </button>
          <button
            onClick={() => {
              onApply(localFilters);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
          >
            Áp dụng
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DeleteConfirmationModal = ({ petName, onClose, onConfirm }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full border-l-4 border-red-500"
        variants={modalVariants}
      >
        <div className="flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-full text-red-600">
            <HiOutlineExclamation size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Xác nhận xóa
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa vĩnh viễn thú cưng{" "}
              <strong>"{petName}"</strong> không? <br />
              Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm shadow-md"
          >
            Đồng ý xóa
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function PetsManagement() {
  const {
    pets,
    categories,
    loading,
    totalPages,
    totalElements,
    fetchPets,
    savePet,
    deletePet,
  } = usePetManagement();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category_id: "",
    status: "",
    price: "",
  });
  const [expandedItems, setExpandedItems] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    petId: null,
    petName: "",
  });
  const [currentPet, setCurrentPet] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => fetchPets(page, searchQuery, filters), 300);
    return () => clearTimeout(timer);
  }, [page, searchQuery, filters, fetchPets]);

  const toggleExpand = (id) =>
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleOpenEditModal = (pet) => {
    setCurrentPet(pet);
    setIsEditModalOpen(true);
  };
  const handleOpenDeleteModal = (id, name) => {
    setDeleteModal({ isOpen: true, petId: id, petName: name });
  };
  const handleConfirmDelete = async () => {
    if (deleteModal.petId) {
      const success = await deletePet(deleteModal.petId);
      if (success) fetchPets(page, searchQuery, filters);
      setDeleteModal({ isOpen: false, petId: null, petName: "" });
    }
  };

  const renderRow = (item) => {
    const isExpanded = expandedItems[item.pet_id];
    return (
      <React.Fragment key={item.pet_id}>
        <tr
          className={`transition-colors border-b ${
            isExpanded ? "bg-blue-50/50 border-blue-200" : "hover:bg-gray-50"
          }`}
        >
          <td className="px-6 py-4 text-sm font-mono text-gray-500">
            {item.pet_id}
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <img
                src={getPetThumbnail(item.images)}
                alt=""
                referrerPolicy="no-referrer"
                className="w-12 h-12 object-cover rounded-md border bg-white shadow-sm"
                onError={(e) => (e.target.src = "https://placehold.co/50")}
              />
              <div>
                <p
                  className="text-sm font-bold text-gray-800 truncate max-w-[150px]"
                  title={item.name}
                >
                  {item.name}
                </p>
                <span className="text-[10px] uppercase font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {item.category_name}
                </span>
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <span
              className={`font-semibold ${
                item.stock_quantity > 0 ? "text-gray-800" : "text-red-500"
              }`}
            >
              {item.stock_quantity}
            </span>
          </td>
          <td className="px-6 py-4">
            <p className="text-sm font-bold text-blue-600">
              {formatCurrency(item.price)}
            </p>
            {item.discount_price > 0 && (
              <p className="text-xs text-gray-400 line-through">
                {formatCurrency(item.price * 1.2)}
              </p>
            )}
          </td>
          <td className="px-6 py-4">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full ${
                item.status === "AVAILABLE"
                  ? "bg-green-100 text-green-700"
                  : item.status === "SOLD"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {item.status}
            </span>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => toggleExpand(item.pet_id)}
                className={`p-2 rounded border transition-all shadow-sm ${
                  isExpanded
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
                title="Chi tiết"
              >
                {isExpanded ? <HiChevronUp size={16} /> : <HiEye size={16} />}
              </button>
              <button
                onClick={() => handleOpenEditModal(item)}
                className="p-2 bg-white border border-gray-200 text-blue-600 rounded hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                title="Sửa"
              >
                <HiPencil size={16} />
              </button>
              <button
                onClick={() => handleOpenDeleteModal(item.pet_id, item.name)}
                className="p-2 bg-white border border-gray-200 text-red-600 rounded hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
                title="Xóa"
              >
                <HiTrash size={16} />
              </button>
            </div>
          </td>
        </tr>
        {isExpanded && (
          <tr className="bg-blue-50/50 border-b-2 border-blue-100">
            <td colSpan="6" className="p-6 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 text-blue-800 border-b border-blue-200 pb-2">
                  <HiInformationCircle className="text-xl" />{" "}
                  <h3 className="text-lg font-bold">
                    Chi tiết thông tin đầy đủ
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <HiPhotograph /> Album ảnh ({item.images?.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {item.images?.length > 0 ? (
                        item.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group aspect-square overflow-hidden rounded-lg border border-gray-300 shadow-sm bg-white"
                          >
                            <img
                              src={transformGoogleDriveUrl(img.image_url)}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                              onError={(e) =>
                                (e.target.src = "https://placehold.co/150")
                              }
                            />
                            {img.is_thumbnail && (
                              <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md">
                                MAIN
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic border p-4 rounded bg-white text-center">
                          Chưa có ảnh nào.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-8 space-y-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                        Đặc điểm vật lý
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                        <div>
                          <span className="text-gray-500 block text-xs mb-0.5">
                            Màu sắc
                          </span>{" "}
                          <span className="font-medium text-gray-800 flex items-center gap-1">
                            <FaPalette className="text-gray-400" /> {item.color}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs mb-0.5">
                            Giới tính
                          </span>{" "}
                          <span className="font-medium text-gray-800 flex items-center gap-1">
                            <FaPaw className="text-gray-400" />{" "}
                            {item.gender === "MALE"
                              ? "Đực"
                              : item.gender === "FEMALE"
                              ? "Cái"
                              : "Chưa rõ"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs mb-0.5">
                            Tuổi
                          </span>{" "}
                          <span className="font-medium text-gray-800">
                            {item.age} tháng
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs mb-0.5">
                            Cân nặng
                          </span>{" "}
                          <span className="font-medium text-gray-800 flex items-center gap-1">
                            <FaWeight className="text-gray-400" /> {item.weight}{" "}
                            kg
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs mb-0.5">
                            Chiều cao
                          </span>{" "}
                          <span className="font-medium text-gray-800 flex items-center gap-1">
                            <FaRulerVertical className="text-gray-400" />{" "}
                            {item.height} cm
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs mb-0.5">
                            Loại lông
                          </span>{" "}
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded border">
                            {item.fur_type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                          <FaStethoscope /> Sức khỏe & Tiêm chủng
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between border-b border-blue-200 pb-2">
                            <span className="text-gray-600">Tình trạng:</span>
                            <span className="font-bold text-blue-900">
                              {item.health_status || "---"}
                            </span>
                          </div>
                          <div className="flex justify-between pt-1">
                            <span className="text-gray-600 flex items-center gap-1">
                              <FaSyringe /> Vaccine:
                            </span>
                            <span className="font-medium text-gray-800 text-right max-w-[60%]">
                              {item.vaccination_history || "Chưa có lịch sử"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col">
                        <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                          Mô tả chi tiết
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed italic flex-1">
                          "{item.description || "Không có mô tả chi tiết."}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6">
          Quản Lý Thú Cưng
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <HiOutlineCube size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Tổng sản phẩm
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalElements}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
            >
              <HiPlus className="text-lg" /> Thêm Mới
            </button>
          </div>
          <div className="flex flex-1 gap-3 w-full md:w-auto justify-end">
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <HiSearch size={20} />
              </span>
              <input
                type="text"
                placeholder="Tìm tên thú cưng..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <select
              className="w-full md:w-48 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={filters.category_id}
              onChange={(e) => {
                setFilters({ ...filters, category_id: e.target.value });
                setPage(1);
              }}
            >
              <option value="">-- Tất cả loại --</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-all active:scale-95"
            >
              <HiFilter size={20} />{" "}
              <span className="hidden sm:inline">Bộ lọc</span>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-2 text-sm font-medium text-blue-600">
                  Đang tải...
                </p>
              </div>
            </div>
          )}
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-24">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Thông tin
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Giá bán
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pets.length > 0 ? (
                pets.map((item) => renderRow(item))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-16">
                    <div className="flex flex-col items-center text-gray-400">
                      <HiOutlineCube size={40} strokeWidth={1} />
                      <p className="mt-2 text-sm">
                        Không tìm thấy thú cưng nào.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-3 border rounded-lg hover:bg-white disabled:opacity-50 bg-white shadow-sm transition-all"
            >
              <FaChevronLeft />
            </button>
            <span className="text-sm font-bold text-gray-700 bg-white px-4 py-2 rounded-lg border shadow-sm">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-3 border rounded-lg hover:bg-white disabled:opacity-50 bg-white shadow-sm transition-all"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
        <AnimatePresence>
          {isAddModalOpen && (
            <AddPetModal
              onClose={() => setIsAddModalOpen(false)}
              categories={categories}
              onSave={async (data) => {
                const success = await savePet(data);
                if (success) fetchPets(1, searchQuery, filters);
                return success;
              }}
            />
          )}
          {isEditModalOpen && currentPet && (
            <EditPetModal
              pet={currentPet}
              onClose={() => setIsEditModalOpen(false)}
              categories={categories}
              onSave={async (data) => {
                const success = await savePet(data);
                if (success) fetchPets(page, searchQuery, filters);
                return success;
              }}
            />
          )}
          {isFilterModalOpen && (
            <FilterModal
              onClose={() => setIsFilterModalOpen(false)}
              filters={filters}
              onApply={(f) => {
                setFilters(f);
                setPage(1);
              }}
              categories={categories}
            />
          )}
          {deleteModal.isOpen && (
            <DeleteConfirmationModal
              petName={deleteModal.petName}
              onClose={() =>
                setDeleteModal({ isOpen: false, petId: null, petName: "" })
              }
              onConfirm={handleConfirmDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

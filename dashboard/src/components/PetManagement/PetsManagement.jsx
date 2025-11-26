"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
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

// --- 1. HELPERS & CONFIG ---
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
  if (!url) return "";
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

// --- 2. SUB-COMPONENTS (Định nghĩa RA NGOÀI để tránh lỗi ReferenceError) ---

// Component Form dùng chung
const PetForm = ({ initialData, onDataChange, categories }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onDataChange((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImageRow = () => {
    onDataChange((prev) => ({
      ...prev,
      images: [
        ...(prev.images || []),
        { image_id: null, image_url: "", is_thumbnail: false },
      ],
    }));
  };

  const handleImageChange = (index, field, value) => {
    const newImages = [...(initialData.images || [])];
    newImages[index] = { ...newImages[index], [field]: value };
    if (field === "is_thumbnail" && value === true) {
      newImages.forEach((img, i) => {
        if (i !== index) img.is_thumbnail = false;
      });
    }
    onDataChange((prev) => ({ ...prev, images: newImages }));
  };

  const handleRemoveImage = (index) => {
    const newImages = initialData.images.filter((_, i) => i !== index);
    onDataChange((prev) => ({ ...prev, images: newImages }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-sm">
      {/* Cột Trái */}
      <div className="md:col-span-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">
              Tên thú cưng <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="name"
              value={initialData.name || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Phân loại</label>
            <select
              name="category_id"
              value={initialData.category_id || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="">-- Chọn --</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Mô tả chi tiết
          </label>
          <textarea
            name="description"
            value={initialData.description || ""}
            onChange={handleChange}
            rows={3}
            className="mt-1 p-2 w-full border rounded-md"
          ></textarea>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700">
              Giá bán (VNĐ)
            </label>
            <input
              type="number"
              name="price"
              value={initialData.price || 0}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Giá giảm</label>
            <input
              type="number"
              name="discount_price"
              value={initialData.discount_price || ""}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Tồn kho</label>
            <input
              type="number"
              name="stock_quantity"
              value={initialData.stock_quantity || 0}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
        </div>

        {/* Quản lý ảnh */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <label className="block font-bold text-gray-700 flex items-center gap-2">
              <HiPhotograph /> Album ảnh
            </label>
            <button
              type="button"
              onClick={handleAddImageRow}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 font-semibold flex items-center gap-1"
            >
              <HiPlus /> Thêm ảnh
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {(!initialData.images || initialData.images.length === 0) && (
              <p className="text-xs text-gray-400 italic text-center">
                Chưa có ảnh nào.
              </p>
            )}
            {initialData.images?.map((img, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 bg-white rounded border shadow-sm"
              >
                <img
                  src={
                    transformGoogleDriveUrl(img.image_url) ||
                    "https://placehold.co/50"
                  }
                  className="w-10 h-10 object-cover rounded border"
                  referrerPolicy="no-referrer"
                  onError={(e) => (e.target.src = "https://placehold.co/50")}
                />
                <input
                  type="text"
                  placeholder="Link ảnh..."
                  value={img.image_url || ""}
                  onChange={(e) =>
                    handleImageChange(idx, "image_url", e.target.value)
                  }
                  className="flex-1 p-1 text-sm border rounded"
                />
                <input
                  type="checkbox"
                  checked={img.is_thumbnail || false}
                  onChange={(e) =>
                    handleImageChange(idx, "is_thumbnail", e.target.checked)
                  }
                  title="Ảnh đại diện"
                  className="w-4 h-4"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="text-red-500 hover:bg-red-100 p-1 rounded"
                >
                  <HiTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cột Phải */}
      <div className="md:col-span-4 space-y-4">
        <div className="bg-white p-3 border rounded-md shadow-sm">
          <label className="block font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            name="status"
            value={initialData.status || "DRAFT"}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-gray-50"
          >
            <option value="AVAILABLE">Sẵn sàng bán</option>
            <option value="SOLD">Đã bán hết</option>
            <option value="DRAFT">Bản nháp (Ẩn)</option>
          </select>
        </div>

        <div className="bg-white p-3 border rounded-md shadow-sm space-y-2">
          <h4 className="font-bold text-gray-700 border-b pb-1">Đặc điểm</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Tuổi (tháng)</label>
              <input
                type="number"
                name="age"
                value={initialData.age || 0}
                onChange={handleChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Giới tính</label>
              <select
                name="gender"
                value={initialData.gender || "MALE"}
                onChange={handleChange}
                className="w-full p-1 border rounded"
              >
                <option value="MALE">Đực</option>
                <option value="FEMALE">Cái</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Nặng (kg)</label>
              <input
                type="number"
                name="weight"
                value={initialData.weight || 0}
                onChange={handleChange}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Cao (cm)</label>
              <input
                type="number"
                name="height"
                value={initialData.height || 0}
                onChange={handleChange}
                className="w-full p-1 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500">Màu lông</label>
            <input
              type="text"
              name="color"
              value={initialData.color || ""}
              onChange={handleChange}
              className="w-full p-1 border rounded"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Loại lông</label>
            <select
              name="fur_type"
              value={initialData.fur_type || "SHORT"}
              onChange={handleChange}
              className="w-full p-1 border rounded"
            >
              <option value="SHORT">Ngắn</option>
              <option value="LONG">Dài</option>
              <option value="CURLY">Xoăn</option>
              <option value="NONE">Không lông</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
        </div>

        <div className="bg-blue-50 p-3 border border-blue-100 rounded-md">
          <h4 className="font-bold text-blue-800 mb-2 text-xs">
            Sức khỏe & Vaccine
          </h4>
          <div className="space-y-2">
            <input
              type="text"
              name="health_status"
              value={initialData.health_status || ""}
              onChange={handleChange}
              placeholder="Tình trạng sức khỏe..."
              className="w-full p-1 border rounded text-xs"
            />
            <input
              type="text"
              name="vaccination_history"
              value={initialData.vaccination_history || ""}
              onChange={handleChange}
              placeholder="Lịch sử tiêm..."
              className="w-full p-1 border rounded text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Thêm
const AddPetModal = ({ onClose, categories, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: categories[0]?.category_id || "",
    age: 1,
    gender: "MALE",
    price: 0,
    discount_price: null,
    stock_quantity: 1,
    status: "DRAFT",
    weight: 1,
    height: 20,
    color: "",
    fur_type: "SHORT",
    health_status: "Tốt",
    vaccination_history: "",
    images: [],
  });

  const handleSave = async () => {
    const success = await onSave(formData);
    if (success) onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">Thêm thú cưng mới</h2>
          <button onClick={onClose}>
            <HiX size={24} />
          </button>
        </div>
        <PetForm
          initialData={formData}
          onDataChange={setFormData}
          categories={categories}
        />
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
          >
            Lưu Thú Cưng
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Modal Sửa
const EditPetModal = ({ pet, onClose, categories, onSave }) => {
  const [formData, setFormData] = useState(pet);
  const handleSave = async () => {
    const success = await onSave(formData);
    if (success) onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Chỉnh sửa: {formData.name}
          </h2>
          <button onClick={onClose}>
            <HiX size={24} />
          </button>
        </div>
        <PetForm
          initialData={formData}
          onDataChange={setFormData}
          categories={categories}
        />
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
          >
            Cập nhật
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Modal Bộ lọc
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

// Modal Xóa (CUSTOM)
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

// --- 3. MAIN COMPONENT ---
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

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Delete Modal State
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

  // --- RENDER TABLE ROW ---
  const renderRow = (item) => {
    const isExpanded = expandedItems[item.pet_id];
    return (
      <React.Fragment key={item.pet_id}>
        <tr
          className={`transition-colors border-b ${
            isExpanded ? "bg-blue-50/50 border-blue-200" : "hover:bg-gray-50"
          }`}
        >
          {/* Column 1: ID */}
          <td className="px-6 py-4 text-sm font-mono text-gray-500">
            {item.pet_id}
          </td>

          {/* Column 2: Thông tin */}
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

          {/* Column 3: Tồn kho (Tách riêng) */}
          <td className="px-6 py-4">
            <span
              className={`font-semibold ${
                item.stock_quantity > 0 ? "text-gray-800" : "text-red-500"
              }`}
            >
              {item.stock_quantity}
            </span>
          </td>

          {/* Column 4: Giá bán (Tách riêng) */}
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

          {/* Column 5: Trạng thái */}
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

          {/* Column 6: Hành động (Gom nút Expand, Edit, Delete vào đây) */}
          <td className="px-6 py-4 text-right">
            <div className="flex justify-end gap-2">
              {/* Nút Chi Tiết */}
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

              {/* Nút Sửa */}
              <button
                onClick={() => handleOpenEditModal(item)}
                className="p-2 bg-white border border-gray-200 text-blue-600 rounded hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                title="Sửa"
              >
                <HiPencil size={16} />
              </button>

              {/* Nút Xóa (Mở Modal Custom) */}
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

        {/* --- EXPANDED SECTION (CHI TIẾT ĐẦY ĐỦ - STYLE MỚI) --- */}
        {isExpanded && (
          <tr className="bg-blue-50/50 border-b-2 border-blue-100">
            <td colSpan="6" className="p-6 relative">
              {/* Thanh chỉ dẫn màu xanh bên trái */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>

              <div className="flex flex-col gap-6">
                {/* Header Chi tiết */}
                <div className="flex items-center gap-2 text-blue-800 border-b border-blue-200 pb-2">
                  <HiInformationCircle className="text-xl" />
                  <h3 className="text-lg font-bold">
                    Chi tiết thông tin đầy đủ
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Cột Trái: Album Ảnh (4/12) */}
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

                  {/* Cột Phải: Thông tin chi tiết (8/12) */}
                  <div className="md:col-span-8 space-y-6">
                    {/* Block 1: Thông tin vật lý */}
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

                    {/* Block 2: Sức khỏe & Mô tả (Grid 2 cột) */}
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

        {/* Stats */}
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

        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex gap-2 w-full md:w-auto">
            {/* Nút Thêm Mới - Đã kiểm tra onClick */}
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

        {/* TABLE */}
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

        {/* PAGINATION */}
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

        {/* Modals */}
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

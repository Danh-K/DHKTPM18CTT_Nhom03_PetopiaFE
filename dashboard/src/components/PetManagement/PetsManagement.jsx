"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Import Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  HiPlus,
  HiMail,
  HiPencil,
  HiTrash,
  HiChevronDown,
  HiChevronUp,
  HiX,
  HiFilter,
  HiOutlineCube,
  HiSearch,
  HiPhotograph,
} from "react-icons/hi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { usePetManagement } from "../../hooks/usePetManagement";

// --- CONFIG & HELPERS ---
const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
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

// --- COMPONENT FORM NÂNG CẤP (QUẢN LÝ ẢNH) ---
const PetForm = ({ initialData, onDataChange, categories }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onDataChange((prev) => ({ ...prev, [name]: value }));
  };

  // -- Logic xử lý mảng ảnh --
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
    const newImages = [...initialData.images];
    newImages[index] = { ...newImages[index], [field]: value };

    // Nếu set thumbnail = true, bỏ các cái khác
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cột 1: Thông tin chung */}
      <div className="md:col-span-2 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            name="description"
            value={initialData.description || ""}
            onChange={handleChange}
            rows={3}
            className="mt-1 p-2 w-full border rounded-md"
          ></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phân loại
            </label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              name="status"
              value={initialData.status || "DRAFT"}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="AVAILABLE">Sẵn sàng (Available)</option>
              <option value="SOLD">Đã bán (Sold)</option>
              <option value="DRAFT">Nháp (Draft)</option>
            </select>
          </div>
        </div>

        {/* --- QUẢN LÝ ẢNH (NEW) --- */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
              <HiPhotograph /> Quản lý hình ảnh
            </label>
            <button
              type="button"
              onClick={handleAddImageRow}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 font-semibold flex items-center gap-1"
            >
              <HiPlus /> Thêm ảnh
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {(!initialData.images || initialData.images.length === 0) && (
              <p className="text-xs text-gray-400 italic text-center py-2">
                Chưa có hình ảnh nào.
              </p>
            )}

            {initialData.images?.map((img, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 bg-white rounded border shadow-sm"
              >
                {/* Preview Image */}
                <img
                  src={
                    transformGoogleDriveUrl(img.image_url) ||
                    "https://placehold.co/50?text=?"
                  }
                  alt=""
                  className="w-12 h-12 object-cover rounded border bg-gray-100 flex-shrink-0"
                  referrerPolicy="no-referrer"
                  onError={(e) =>
                    (e.target.src = "https://placehold.co/50?text=Err")
                  }
                />

                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    placeholder="Dán link ảnh (Google Drive, Imgur...)"
                    value={img.image_url || ""}
                    onChange={(e) =>
                      handleImageChange(idx, "image_url", e.target.value)
                    }
                    className="w-full p-1 text-sm border rounded focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs text-gray-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={img.is_thumbnail || false}
                        onChange={(e) =>
                          handleImageChange(
                            idx,
                            "is_thumbnail",
                            e.target.checked
                          )
                        }
                        className="rounded text-blue-600"
                      />
                      Ảnh đại diện
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                  title="Xóa ảnh này"
                >
                  <HiTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cột 2: Giá & Chỉ số */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Giá (VNĐ)
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
          <label className="block text-sm font-medium text-gray-700">
            Giá giảm
          </label>
          <input
            type="number"
            name="discount_price"
            value={initialData.discount_price || ""}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tồn kho
          </label>
          <input
            type="number"
            name="stock_quantity"
            value={initialData.stock_quantity || 0}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <hr className="border-gray-200 my-2" />

        {/* Chi tiết vật lý rút gọn */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600">Tuổi (tháng)</label>
            <input
              type="number"
              name="age"
              value={initialData.age || 0}
              onChange={handleChange}
              className="mt-1 p-1.5 w-full border rounded text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Giới tính</label>
            <select
              name="gender"
              value={initialData.gender || "MALE"}
              onChange={handleChange}
              className="mt-1 p-1.5 w-full border rounded text-sm"
            >
              <option value="MALE">Đực</option>
              <option value="FEMALE">Cái</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600">Cân nặng (kg)</label>
            <input
              type="number"
              name="weight"
              value={initialData.weight || 0}
              onChange={handleChange}
              className="mt-1 p-1.5 w-full border rounded text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Cao (cm)</label>
            <input
              type="number"
              name="height"
              value={initialData.height || 0}
              onChange={handleChange}
              className="mt-1 p-1.5 w-full border rounded text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-600">Màu sắc</label>
          <input
            type="text"
            name="color"
            value={initialData.color || ""}
            onChange={handleChange}
            className="mt-1 p-1.5 w-full border rounded text-sm"
          />
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
    images: [], // Mảng ảnh rỗng ban đầu
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
        className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
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

const EditPetModal = ({ pet, onClose, categories, onSave, onDelete }) => {
  const [formData, setFormData] = useState(pet);

  const handleSave = async () => {
    const success = await onSave(formData);
    if (success) onClose();
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `CẢNH BÁO: Bạn có chắc chắn muốn xóa "${pet.name}" không? Hành động này không thể hoàn tác.`
      )
    ) {
      const success = await onDelete(pet.pet_id);
      if (success) onClose();
    }
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
        className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
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
        <div className="flex justify-between mt-6 pt-4 border-t">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100"
          >
            <HiTrash /> Xóa Pet
          </button>
          <div className="flex gap-3">
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
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- MAIN SCREEN ---
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

  // States
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category_id: "",
    status: "",
    price: "",
  });
  const [expandedItems, setExpandedItems] = useState({});

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);

  // 1. Gọi API khi Page/Search/Filter thay đổi
  useEffect(() => {
    // Timeout để debounce search (tránh gọi API liên tục khi gõ)
    const timer = setTimeout(() => {
      fetchPets(page, searchQuery, filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [page, searchQuery, filters, fetchPets]);

  const toggleExpand = (id) =>
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleOpenEditModal = (pet) => {
    setCurrentPet(pet);
    setIsEditModalOpen(true);
  };
  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Thêm Toast Container để hiển thị thông báo */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Quản Lý Thú Cưng
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <HiOutlineCube size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-800">
                {totalElements}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all"
            >
              <HiPlus /> Thêm Mới
            </button>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <HiSearch className="text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Tìm tên thú cưng..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            {/* Bộ lọc đơn giản ngay trên thanh công cụ */}
            <select
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
              value={filters.category_id}
              onChange={(e) => {
                setFilters({ ...filters, category_id: e.target.value });
                setPage(1);
              }}
            >
              <option value="">Tất cả loại</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Thú cưng
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pets.length > 0 ? (
                pets.map((item) => (
                  <React.Fragment key={item.pet_id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getPetThumbnail(item.images)}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-md border bg-gray-50"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/150x150?text=Err";
                            }}
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.category_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {item.stock_quantity}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-blue-600">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            item.status === "AVAILABLE"
                              ? "bg-green-100 text-green-800"
                              : item.status === "SOLD"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                        >
                          <HiPencil size={18} />
                        </button>
                        <button
                          onClick={() => toggleExpand(item.pet_id)}
                          className="p-2 text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          {expandedItems[item.pet_id] ? (
                            <HiChevronUp size={18} />
                          ) : (
                            <HiChevronDown size={18} />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Detail */}
                    {expandedItems[item.pet_id] && (
                      <tr className="bg-gray-50">
                        <td colSpan="6" className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            {/* List Ảnh */}
                            <div className="md:col-span-1">
                              <p className="font-bold mb-2">
                                Hình ảnh ({item.images?.length})
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.images?.map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={transformGoogleDriveUrl(img.image_url)}
                                    referrerPolicy="no-referrer"
                                    className="w-20 h-20 object-cover rounded border bg-white"
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="md:col-span-3 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-gray-500">Màu sắc</p>
                                <p className="font-medium">{item.color}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Giới tính</p>
                                <p className="font-medium">{item.gender}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Cân nặng</p>
                                <p className="font-medium">{item.weight} kg</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Mô tả</p>
                                <p className="font-medium text-gray-700 line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500">
                    Không tìm thấy dữ liệu phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 bg-gray-50"
            >
              <FaChevronLeft />
            </button>
            <span className="text-sm font-medium text-gray-600">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 bg-gray-50"
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
                if (success) {
                  fetchPets(1, searchQuery, filters); // Load lại trang 1 sau khi thêm
                  return true;
                }
                return false;
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
                if (success) {
                  fetchPets(page, searchQuery, filters); // Load lại trang hiện tại
                  return true;
                }
                return false;
              }}
              onDelete={async (id) => {
                const success = await deletePet(id);
                if (success) {
                  fetchPets(page, searchQuery, filters);
                  return true;
                }
                return false;
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

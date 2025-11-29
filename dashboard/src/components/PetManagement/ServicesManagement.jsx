import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Loader,
  DollarSign,
  FileText,
  Type,
  AlertTriangle,
  ImageIcon,
  ListFilter,
} from "lucide-react";
import { toast } from "react-toastify";
import { useServiceManagement } from "../../hooks/useServiceManagement";

// --- SUB-COMPONENT: DELETE CONFIRM MODAL ---
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Xác nhận xóa?
          </h3>
          <p className="text-sm text-gray-500">
            Bạn có chắc chắn muốn xóa dịch vụ này không? Hành động này không thể
            hoàn tác.
          </p>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium shadow-md transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {isDeleting ? (
              <Loader className="animate-spin h-5 w-5" />
            ) : (
              "Xóa ngay"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const ServiceManagement = () => {
  const {
    services,
    loading,
    totalPages,
    totalElements,
    fetchServices,
    createService,
    updateService,
    removeService,
  } = useServiceManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [hoveredId, setHoveredId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchServices(searchTerm, currentPage, pageSize);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage, pageSize, fetchServices]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File ảnh quá lớn (Max 5MB)");
        return;
      }
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({ name: "", description: "", price: "" });
    setSelectedImage(null);
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
    });
    setSelectedImage(null);
    setPreviewImage(service.imageUrl);
    setIsModalOpen(true);
  };

  const confirmDelete = (service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteExecute = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    const success = await removeService(serviceToDelete.serviceId);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);

    if (success) {
      if (services.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchServices(searchTerm, currentPage, pageSize);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.warning("Vui lòng điền tên và giá dịch vụ");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
    };

    let success = false;
    if (editingService) {
      success = await updateService(
        editingService.serviceId,
        payload,
        selectedImage
      );
    } else {
      success = await createService(payload, selectedImage);
    }

    setIsSubmitting(false);

    if (success) {
      setIsModalOpen(false);
      fetchServices(searchTerm, currentPage, pageSize);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Quản Lý Dịch Vụ
          </h1>
          <p className="text-slate-500 mt-2">
            Tổng cộng:{" "}
            <span className="font-bold text-blue-600">{totalElements}</span>{" "}
            dịch vụ trong hệ thống
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Thêm Dịch Vụ</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 max-w-xl flex-1">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-4 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên dịch vụ..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 font-medium rounded-xl focus:ring-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
          <ListFilter className="text-slate-500 h-5 w-5" />
          <span className="text-sm text-slate-600 font-medium whitespace-nowrap">
            Hiển thị:
          </span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none font-bold"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-80">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.serviceId}
                // --- CHỈNH SỬA Ở ĐÂY: Thêm border-2 và border-slate-200, hover border màu xanh ---
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl 
                           border-2 border-slate-200 hover:border-blue-500 hover:ring-4 hover:ring-blue-50
                           transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-2"
                onMouseEnter={() => setHoveredId(service.serviceId)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={
                      service.imageUrl ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-emerald-600 shadow-md flex items-center gap-1">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(service.price)}
                  </div>

                  <div className="absolute top-3 left-3 bg-slate-900/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-white">
                    #{service.serviceId}
                  </div>

                  <div
                    className={`absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center gap-3 transition-opacity duration-300 ${
                      hoveredId === service.serviceId
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(service);
                      }}
                      className="bg-white text-yellow-600 p-3 rounded-xl hover:bg-yellow-50 transform hover:scale-110 transition-all shadow-lg"
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(service);
                      }}
                      className="bg-white text-red-600 p-3 rounded-xl hover:bg-red-50 transform hover:scale-110 transition-all shadow-lg"
                      title="Xóa"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                    {service.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Trạng thái
                    </span>
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                      Hoạt động
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
              <div className="bg-slate-100 p-6 rounded-full mb-4">
                <Search className="h-10 w-10" />
              </div>
              <p className="text-lg font-medium">
                Không tìm thấy dịch vụ nào phù hợp.
              </p>
            </div>
          )}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            Hiển thị trang{" "}
            <span className="font-bold text-slate-800">{currentPage}</span> trên
            tổng số{" "}
            <span className="font-bold text-slate-800">{totalPages}</span> trang
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div className="hidden sm:flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-bold transition-all ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return (
                    <span
                      key={pageNum}
                      className="w-10 h-10 flex items-center justify-center text-slate-400"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingService ? "Cập Nhật Dịch Vụ" : "Thêm Mới Dịch Vụ"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6 overflow-y-auto"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-blue-500" /> Hình Ảnh
                </label>
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all overflow-hidden relative group"
                >
                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-medium">
                          Nhấn để thay đổi
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                      <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                        <UploadCloud className="w-8 h-8 text-blue-500" />
                      </div>
                      <p className="mb-1 text-sm font-semibold text-slate-600">
                        Click để tải ảnh lên
                      </p>
                      <p className="text-xs text-slate-400">
                        PNG, JPG (Tối đa 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                    <Type className="h-4 w-4 text-blue-500" /> Tên Dịch Vụ
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Spa tắm rửa thú cưng"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" /> Giá Dịch
                    Vụ (VND)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-500" /> Mô Tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Mô tả chi tiết..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold transition-all disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 font-bold transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin h-5 w-5" /> Đang xử lý...
                    </>
                  ) : (
                    <>{editingService ? "Lưu Thay Đổi" : "Tạo Dịch Vụ"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteExecute}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ServiceManagement;

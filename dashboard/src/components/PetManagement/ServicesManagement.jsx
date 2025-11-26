import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- FAKE DATA ---
const INITIAL_DATA = [
  {
    serviceId: "S001",
    name: "Pet Training Basic",
    description:
      "Khóa huấn luyện cơ bản giúp thú cưng nghe lời và ngoan ngoãn hơn.",
    price: 234.0,
    imageUrl:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=500",
  },
  {
    serviceId: "S002",
    name: "Veterinary Care",
    description:
      "Dịch vụ chăm sóc thú y toàn diện, tiêm phòng và kiểm tra sức khỏe.",
    price: 72.0,
    imageUrl:
      "https://images.unsplash.com/photo-1628009368231-7603358486cf?auto=format&fit=crop&q=80&w=500",
  },
  {
    serviceId: "S003",
    name: "Pet Hotel (Boarding)",
    description:
      "Khách sạn thú cưng tiêu chuẩn 5 sao, máy lạnh và thức ăn ngon.",
    price: 172.0,
    imageUrl:
      "https://images.unsplash.com/photo-1597595280738-947b0eb23da6?auto=format&fit=crop&q=80&w=500",
  },
  {
    serviceId: "S004",
    name: "Dog Walking",
    description: "Dắt chó đi dạo mỗi ngày tại công viên xanh mát.",
    price: 45.0,
    imageUrl:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=500",
  },
  {
    serviceId: "S005",
    name: "Pet Spa & Grooming",
    description: "Cắt tỉa lông, tắm rửa và massage thư giãn cho thú cưng.",
    price: 89.0,
    imageUrl:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=500",
  },
  {
    serviceId: "S006",
    name: "Pet Dental Care",
    description: "Lấy cao răng và chăm sóc sức khỏe răng miệng.",
    price: 120.0,
    imageUrl:
      "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&q=80&w=500",
  },
  {
    serviceId: "S007",
    name: "Nutrition Consulting",
    description: "Tư vấn chế độ dinh dưỡng phù hợp cho từng giống loài.",
    price: 55.0,
    imageUrl:
      "https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&q=80&w=500",
  },
];

const ServiceManagement = () => {
  // --- STATES ---
  const [services, setServices] = useState(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Hover State (FIX CHO BẠN: Dùng JS để bắt hover thay vì CSS thuần)
  const [hoveredId, setHoveredId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    serviceId: "",
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  // --- FILTERS & PAGINATION ---
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  // --- HANDLERS ---
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      serviceId: `S${Math.floor(Math.random() * 1000)}`,
      name: "",
      description: "",
      price: "",
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData(service);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) {
      setServices(services.filter((s) => s.serviceId !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Vui lòng điền tên và giá");
      return;
    }
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
    };
    if (editingService) {
      setServices(
        services.map((s) => (s.serviceId === payload.serviceId ? payload : s))
      );
    } else {
      setServices([...services, payload]);
    }
    setIsModalOpen(false);
  };

  // --- RENDER ---
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* 1. HEADER & CONTROLS */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Quản Lý Dịch Vụ
        </h1>
        <p className="text-gray-500 mb-6">
          Quản lý các gói dịch vụ chăm sóc thú cưng
        </p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full md:w-auto justify-center"
          >
            <Plus className="h-5 w-5" />
            <span>Thêm Dịch Vụ</span>
          </button>
        </div>
      </div>

      {/* 2. GRID LIST (SỬ DỤNG REACT STATE CHO HOVER) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.length > 0 ? (
          currentItems.map((service) => (
            <div
              key={service.serviceId}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
            >
              {/* Image Wrapper */}
              <div
                className="relative h-48 overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredId(service.serviceId)} // Bắt sự kiện chuột vào
                onMouseLeave={() => setHoveredId(null)} // Bắt sự kiện chuột ra
              >
                <img
                  src={
                    service.imageUrl ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={service.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    hoveredId === service.serviceId ? "scale-110" : "scale-100"
                  }`}
                />

                {/* Badge ID */}
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-blue-800 shadow-sm z-20">
                  {service.serviceId}
                </div>

                {/* OVERLAY ACTIONS - Dùng điều kiện JS để hiển thị thay vì CSS hover */}
                <div
                  className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 transition-opacity duration-300 z-10 ${
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
                    className={`bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg transform transition-all duration-300 ${
                      hoveredId === service.serviceId
                        ? "translate-y-0"
                        : "translate-y-4"
                    }`}
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(service.serviceId);
                    }}
                    className={`bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transform transition-all duration-300 delay-75 ${
                      hoveredId === service.serviceId
                        ? "translate-y-0"
                        : "translate-y-4"
                    }`}
                    title="Xóa"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className="text-lg font-bold text-gray-800 line-clamp-1"
                    title={service.name}
                  >
                    {service.name}
                  </h3>
                  <span className="text-lg font-bold text-green-600 whitespace-nowrap ml-2">
                    ${service.price}
                  </span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
                  {service.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                  <span>Updated: Today</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            Không tìm thấy dịch vụ nào.
          </div>
        )}
      </div>

      {/* 3. PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="px-4 py-2 text-gray-600 font-medium">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* 4. MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {editingService ? "Cập Nhật Dịch Vụ" : "Thêm Dịch Vụ Mới"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã Dịch Vụ
                </label>
                <input
                  type="text"
                  name="serviceId"
                  value={formData.serviceId}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Dịch Vụ
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Pet Grooming"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Ảnh
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô Tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Mô tả chi tiết về dịch vụ..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  {editingService ? "Lưu Thay Đổi" : "Tạo Mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;

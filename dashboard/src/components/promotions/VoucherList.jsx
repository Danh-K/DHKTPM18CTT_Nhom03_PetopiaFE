"use client";

import { useState } from "react";
import { HiPlus } from "react-icons/hi";

// Import từ thư mục voucher (đi lên 1 cấp rồi vào voucher)
import VoucherStatsCards from "./voucher/VoucherStatsCards";
import VoucherFilters from "./voucher/VoucherFilters";
import VoucherCard from "./voucher/VoucherCard";
import VoucherPagination from "./voucher/VoucherPagination";
import ImageLightbox from "./voucher/ImageLightbox";
import VoucherFormModal from "./voucher/VoucherFormModal";
import ViewVoucherModal from "./voucher/ViewVoucherModal";

const ITEMS_PER_PAGE = 9;

const initialVouchers = [
  {
    id: 1,
    code: "SUMMER2024",
    description: "Giảm giá mùa hè đặc biệt",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 300000,
    maxDiscount: 100000,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    usageLimit: 200,
    usedCount: 87,
    status: "active",
    image: "/images/vouchers/summer-2024.jpg",
  },
  {
    id: 2,
    code: "WELCOME15",
    description: "Voucher chào mừng khách mới",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 0,
    maxDiscount: null,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageLimit: 1000,
    usedCount: 567,
    status: "active",
    image: "/images/vouchers/welcome-voucher.jpg",
  },
  {
    id: 3,
    code: "FLASH100K",
    description: "Giảm ngay 100K cho đơn từ 500K",
    discountType: "fixed",
    discountValue: 100000,
    minOrderValue: 500000,
    maxDiscount: null,
    startDate: "2024-11-25",
    endDate: "2024-11-30",
    usageLimit: 50,
    usedCount: 48,
    status: "active",
    image: "/images/vouchers/flash-sale.jpg",
  },
  {
    id: 4,
    code: "FREESHIP99",
    description: "Miễn phí vận chuyển toàn quốc",
    discountType: "fixed",
    discountValue: 30000,
    minOrderValue: 199000,
    maxDiscount: null,
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    usageLimit: 500,
    usedCount: 412,
    status: "active",
    image: "/images/vouchers/freeship.jpg",
  },
];

export default function VoucherList({ darkMode }) {
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Lọc dữ liệu
  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    const matchesType = typeFilter === "all" || v.discountType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredVouchers.length / ITEMS_PER_PAGE);
  const paginatedVouchers = filteredVouchers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = {
    active: vouchers.filter((v) => v.status === "active").length,
    total: vouchers.length,
    remainingUses: vouchers.reduce(
      (acc, v) => acc + Math.max(0, (v.usageLimit || 0) - v.usedCount),
      0
    ),
  };

  const handleAdd = (newVoucher) => {
    setVouchers((prev) => [...prev, { ...newVoucher, usedCount: 0 }]);
    setShowAddModal(false);
  };

  const handleEdit = (updated) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === updated.id ? updated : v))
    );
    setShowEditModal(false);
    setSelectedVoucher(null);
  };

  const handleDelete = (id) =>
    confirm("Xóa voucher này vĩnh viễn?") &&
    setVouchers((prev) => prev.filter((v) => v.id !== id));

  const handleDuplicate = (v) =>
    setVouchers((prev) => [
      ...prev,
      { ...v, id: Date.now(), code: `${v.code}_COPY`, usedCount: 0 },
    ]);

  const handleToggleStatus = (id) =>
    setVouchers((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: v.status === "active" ? "inactive" : "active" }
          : v
      )
    );

  return (
    <div className="space-y-6">
      <VoucherStatsCards darkMode={darkMode} {...stats} />

      <div
        className={`rounded-xl shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#7b4f35]">Quản lý Voucher</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
          >
            <HiPlus className="h-5 w-5" /> Tạo mới
          </button>
        </div>

        {/* Filters */}
        <VoucherFilters
          darkMode={darkMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />

        {/* Danh sách */}
        <div className="p-6">
          {paginatedVouchers.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-lg">
              Không tìm thấy voucher nào
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedVouchers.map((v) => (
                <VoucherCard
                  key={v.id}
                  voucher={v}
                  darkMode={darkMode}
                  onView={() => {
                    setSelectedVoucher(v);
                    setShowViewModal(true);
                  }}
                  onEdit={() => {
                    setSelectedVoucher(v);
                    setShowEditModal(true);
                  }}
                  onDelete={() => handleDelete(v.id)}
                  onDuplicate={() => handleDuplicate(v)}
                  onToggleStatus={() => handleToggleStatus(v.id)}
                  onImageClick={(img) =>
                    setLightboxImage({ image: img, alt: v.code })
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <VoucherPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredVouchers.length}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* === MODALS === */}
      {showAddModal && (
        <VoucherFormModal
          darkMode={darkMode}
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
        />
      )}

      {showEditModal && selectedVoucher && (
        <VoucherFormModal
          darkMode={darkMode}
          voucher={selectedVoucher}
          onClose={() => {
            setShowEditModal(false);
            setSelectedVoucher(null);
          }}
          onSave={handleEdit}
        />
      )}

      {showViewModal && selectedVoucher && (
        <ViewVoucherModal
          darkMode={darkMode}
          voucher={selectedVoucher}
          onClose={() => {
            setShowViewModal(false);
            setSelectedVoucher(null);
          }}
        />
      )}

      {lightboxImage && (
        <ImageLightbox
          image={lightboxImage.image}
          alt={lightboxImage.alt}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
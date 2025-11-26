"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPromotions } from "../../store/promotionSlice";
import { HiPlus } from "react-icons/hi";

import AddPromotionModal from "./AddPromotionModal";
import EditPromotionModal from "./EditPromotionModal";
import ViewPromotionModal from "./ViewPromotionModal";

import PromotionStatsCards from "./promotion/PromotionStatsCards";
import PromotionFilters from "./promotion/PromotionFilters";
import PromotionCard from "./promotion/PromotionCard";
import PromotionPagination from "./promotion/PromotionPagination";
import ImageLightbox from "./promotion/ImageLightbox";

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

export default function PromotionList({ darkMode }) {
  const dispatch = useDispatch();
  const { list: serverPromotions, loading, error } = useSelector((state) => state.promotion);
  const [promotions, setPromotions] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const itemsPerPage = 9;

  useEffect(() => {
    dispatch(fetchPromotions({ page: 0, size: 50 }));
  }, [dispatch]);

  useEffect(() => {
    if (serverPromotions?.length > 0) {
      const mapped = serverPromotions.map((p) => ({
        id: p.promotionId,
        name: p.code,
        description: p.description || "",
        discountType: p.promotionType?.toLowerCase() || "percentage",
        discountValue: p.discountValue || null,
        categoryId: p.categoryId || null,
        categoryName: categories.find((c) => c.id === p.categoryId)?.name || "Tất cả danh mục",
        startDate: p.startDate,
        endDate: p.endDate,
        status: p.status?.toLowerCase() || "active",
        image: p.imageUrl || "/placeholder.svg",
      }));
      setPromotions(mapped);
    }
  }, [serverPromotions]);

  const filteredPromotions = promotions.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesType = typeFilter === "all" || p.discountType === typeFilter;
    const matchesCategory =
      categoryFilter === "all" ||
      p.categoryId === categoryFilter ||
      (categoryFilter === "null" && !p.categoryId);
    return matchesSearch && matchesStatus && matchesType && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const paginatedPromotions = filteredPromotions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc muốn xóa khuyến mãi này?")) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (p) => {
    setSelectedPromotion(p);
    setShowEditModal(true);
  };

  const handleView = (p) => {
    setSelectedPromotion(p);
    setShowViewModal(true);
  };

  const handleDuplicate = (p) => {
    setPromotions((prev) => [
      ...prev,
      { ...p, id: Date.now(), name: `${p.name} (Copy)` },
    ]);
  };

  const handleToggleStatus = (id) => {
    setPromotions((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p
      )
    );
  };

  const handleAddPromotion = (newPromo) => {
    const categoryName = categories.find((c) => c.id === newPromo.categoryId)?.name || "Tất cả danh mục";
    setPromotions((prev) => [...prev, { ...newPromo, id: Date.now(), categoryName }]);
    setShowAddModal(false);
  };

  const handleSaveEdit = (updated) => {
    setPromotions((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setShowEditModal(false);
  };

  const stats = {
    active: promotions.filter((p) => p.status === "active").length,
    total: promotions.length,
    avg:
      promotions.filter((p) => p.discountValue).length > 0
        ? Math.round(
            promotions
              .filter((p) => p.discountValue)
              .reduce((a, b) => a + b.discountValue, 0) /
              promotions.filter((p) => p.discountValue).length
          )
        : 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-300 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-[#7b4f35] border-r-emerald-500 border-b-emerald-600 border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-[#7b4f35]">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) return <div className="text-red-500 text-center py-20">{error}</div>;

  return (
    <div className="space-y-6">
      <PromotionStatsCards darkMode={darkMode} {...stats} />

      <div className={`rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#7b4f35]">Quản lý Khuyến mãi</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
          >
            <HiPlus className="h-5 w-5" /> Tạo mới
          </button>
        </div>

        {/* Filters */}
        <PromotionFilters
          darkMode={darkMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          categories={categories}
        />

        {/* Danh sách card */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPromotions.map((p) => (
              <PromotionCard
                key={p.id}
                promotion={p}
                darkMode={darkMode}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onToggleStatus={handleToggleStatus}
                onImageClick={(promo) => setLightboxImage({ image: promo.image, alt: promo.name })}
              />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <PromotionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          totalItems={filteredPromotions.length}
        />
      </div>

      {/* Modals & Lightbox */}
      {lightboxImage && <ImageLightbox {...lightboxImage} onClose={() => setLightboxImage(null)} />}
      {showAddModal && <AddPromotionModal darkMode={darkMode} onClose={() => setShowAddModal(false)} onSave={handleAddPromotion} />}
      {showEditModal && selectedPromotion && (
        <EditPromotionModal darkMode={darkMode} promotion={selectedPromotion} onClose={() => setShowEditModal(false)} onSave={handleSaveEdit} />
      )}
      {showViewModal && selectedPromotion && (
        <ViewPromotionModal darkMode={darkMode} promotion={selectedPromotion} onClose={() => setShowViewModal(false)} />
      )}
    </div>
  );
}
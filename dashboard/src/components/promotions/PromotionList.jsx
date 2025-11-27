"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPromotions,
  searchPromotions,
  setCurrentPage,
  setIsSearching,
  fetchPromotionByCode,
  inactivePromotion,
} from "../../store/promotionSlice";
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

const ITEMS_PER_PAGE = 9;

export default function PromotionList({ darkMode }) {
  const dispatch = useDispatch();
  const {
    list: serverPromotions = [],
    totalElements = 0,
    currentPage = 1,
    loading,
    error,
    isSearching = false,
    selected: selectedPromotion,
  } = useSelector((state) => state.promotion);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const [inactiveId, setInactiveId] = useState(null);
  const [inactiveCode, setInactiveCode] = useState("");

  useEffect(() => {
    dispatch(fetchPromotions({ page: 0, size: ITEMS_PER_PAGE }));
    dispatch(setIsSearching(false));
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasFilter =
        searchTerm.trim() ||
        categoryFilter !== "all" ||
        statusFilter !== "all" ||
        typeFilter !== "all";

      if (hasFilter) {
        dispatch(
          searchPromotions({
            keyword: searchTerm.trim() || null,
            categoryId: categoryFilter === "all" ? null : categoryFilter,
            status: statusFilter === "all" ? null : statusFilter,
            type: typeFilter === "all" ? null : typeFilter.toUpperCase(),
            page: 0,
            size: ITEMS_PER_PAGE,
          })
        );
        dispatch(setCurrentPage(1));
        dispatch(setIsSearching(true));
      } else {
        dispatch(fetchPromotions({ page: 0, size: ITEMS_PER_PAGE }));
        dispatch(setIsSearching(false));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, statusFilter, typeFilter, dispatch]);

  const promotions = serverPromotions.map((p, index) => ({
    id: p.promotionId || p.code || `temp-${index}`,
    code: p.code,
    name: p.code,
    description: p.description || "",
    discountType: p.promotionType?.toLowerCase() || "discount",
    discountValue: p.discountValue || null,
    categoryId: p.categoryId || null,
    categoryName:
      categories.find((c) => c.id === p.categoryId)?.name || "Tất cả danh mục",
    startDate: p.startDate,
    endDate: p.endDate,
    status: p.status === "INACTIVE" ? "inactive" : "active",
    image: p.imageUrl || "/placeholder.svg",
    usedCount: p.usedCount || 0,
    maxUsage: p.maxUsage || null,
    minOrderAmount: p.minOrderAmount || 0,
  }));

  const totalItems = totalElements;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Stats
  const stats = {
    active: promotions.filter((p) => p.status === "active").length,
    total: totalItems,
    remainingUses: promotions
      .filter((p) => p.maxUsage)
      .reduce(
        (acc, p) => acc + Math.max(0, p.maxUsage - (p.usedCount || 0)),
        0
      ),
  };

  // Đổi trang
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));

    const payload = { page: page - 1, size: ITEMS_PER_PAGE };

    if (isSearching) {
      dispatch(
        searchPromotions({
          ...payload,
          keyword: searchTerm.trim() || null,
          categoryId: categoryFilter === "all" ? null : categoryFilter,
          status: statusFilter === "all" ? null : statusFilter,
          type: typeFilter === "all" ? null : typeFilter.toUpperCase(),
        })
      );
    } else {
      dispatch(fetchPromotions(payload));
    }
  };

  const handleInactive = (id, code) => {
    setInactiveId(id);
    setInactiveCode(code);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-300 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-[#7b4f35] border-r-emerald-500 border-b-emerald-600 border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-[#7b4f35]">
              Đang tải...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-20 text-xl">{error}</div>
    );
  }

  return (
    <div className="space-y-6">
      <PromotionStatsCards darkMode={darkMode} {...stats} />

      <div
        className={`rounded-xl shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#7b4f35]">
            Quản lý Khuyến mãi
          </h2>
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

        {/* Danh sách khuyến mãi */}
        <div className="p-6">
          {promotions.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-lg">
              Không tìm thấy khuyến mãi nào
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((p) => (
                <PromotionCard
                  key={p.id}
                  promotion={p}
                  darkMode={darkMode}
                  onView={() => {
                    dispatch(fetchPromotionByCode(p.code));
                    setShowViewModal(true);
                  }}
                  onEdit={() => {
                    dispatch(fetchPromotionByCode(p.code));
                    setShowEditModal(true);
                  }}
                  onDelete={() => handleInactive(p.id, p.code)}
                  onDuplicate={() => {}}
                  onImageClick={(promo) =>
                    setLightboxImage({ image: promo.image, alt: promo.name })
                  }
                />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="px-6 pb-6">
            <PromotionPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={handlePageChange}
              totalItems={totalItems}
            />
          </div>
        )}
      </div>

      {inactiveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setInactiveId(null)}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-center mb-4">
              Vô hiệu hóa khuyến mãi?
            </h3>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              "{inactiveCode}" sẽ không thể sử dụng nữa.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setInactiveId(null)}
                className="px-5 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  dispatch(inactivePromotion(inactiveId));
                  setInactiveId(null);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                Vô hiệu hóa
              </button>
            </div>
          </div>
        </div>
      )}

      {lightboxImage && (
        <ImageLightbox
          {...lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
      {showAddModal && (
        <AddPromotionModal
          darkMode={darkMode}
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            dispatch(fetchPromotions({ page: 0, size: ITEMS_PER_PAGE }));
          }}
        />
      )}
      {showEditModal && selectedPromotion && (
        <EditPromotionModal
          darkMode={darkMode}
          promotion={selectedPromotion}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showViewModal && selectedPromotion && (
        <ViewPromotionModal
          darkMode={darkMode}
          promotion={selectedPromotion}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
}

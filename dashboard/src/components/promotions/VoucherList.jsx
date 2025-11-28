"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVouchers,
  searchVouchers,
  setCurrentPage,
  setIsSearching,
  fetchVoucherByCode,
  inactiveVoucher,
} from "../../store/voucherSlice";
import { HiPlus } from "react-icons/hi";
import VoucherFormModal from "./voucher/VoucherFormModal";
import ViewVoucherModal from "./voucher/ViewVoucherModal";
import VoucherStatsCards from "./voucher/VoucherStatsCards";
import VoucherFilters from "./voucher/VoucherFilters";
import VoucherCard from "./voucher/VoucherCard";
import VoucherPagination from "./voucher/VoucherPagination";
import ImageLightbox from "./ImageLightbox";

const ITEMS_PER_PAGE = 9;

export default function VoucherList({ darkMode }) {
  const dispatch = useDispatch();
  const {
    list: serverVouchers = [],
    totalElements = 0,
    currentPage = 1,
    loading,
    selected: selectedVoucher,
    isSearching = false,
  } = useSelector((state) => state.voucher);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [inactiveId, setInactiveId] = useState(null);

  useEffect(() => {
    dispatch(fetchVouchers({ page: 0, size: ITEMS_PER_PAGE }));
  }, [dispatch]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     const hasFilter = searchTerm.trim() || statusFilter !== "all" || typeFilter !== "all";
  //     if (hasFilter) {
  //       dispatch(searchVouchers({
  //         keyword: searchTerm.trim() || null,
  //         status: statusFilter === "all" ? null : statusFilter,
  //         type: typeFilter === "all" ? null : typeFilter,
  //         page: 0,
  //         size: ITEMS_PER_PAGE,
  //       }));
  //       dispatch(setCurrentPage(1));
  //       dispatch(setIsSearching(true));
  //     } else {
  //       dispatch(fetchVouchers({ page: 0, size: ITEMS_PER_PAGE }));
  //       dispatch(setIsSearching(false));
  //     }
  //   }, 400);
  //   return () => clearTimeout(timer);
  // }, [searchTerm, statusFilter, typeFilter, dispatch]);

  const vouchers = serverVouchers.map(v => ({
    ...v,
    image: v.imageUrl || "/placeholder.https://res.cloudinary.com/dwzjxsdli/image/upload/v1764312578/Gemini_Generated_Image_fg2ooofg2ooofg2o_o8mmjz.png",
  }));

  const totalPages = Math.ceil(totalElements / ITEMS_PER_PAGE);

  const stats = {
    active: vouchers.filter(v => v.status === "ACTIVE").length,
    total: totalElements,
    remainingUses: vouchers.reduce((acc, v) => acc + Math.max(0, (v.maxUsage || 0) - (v.usedCount || 0)), 0),
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    const payload = { page: page - 1, size: ITEMS_PER_PAGE };
    if (isSearching) {
      dispatch(searchVouchers({
        ...payload,
        keyword: searchTerm.trim() || null,
        status: statusFilter === "all" ? null : statusFilter,
        type: typeFilter === "all" ? null : typeFilter,
      }));
    } else {
      dispatch(fetchVouchers(payload));
    }
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

  return (
    <div className="space-y-6">
      <VoucherStatsCards darkMode={darkMode} {...stats} />

      <div className={`rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"} overflow-hidden`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#7b4f35]">Quản lý Voucher</h2>
          <button onClick={() => {}} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md">
            <HiPlus className="h-5 w-5" /> Tạo mới
          </button>
        </div>

        <VoucherFilters
          darkMode={darkMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />

        <div className="p-6">
          {vouchers.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-lg">Không tìm thấy voucher nào</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vouchers.map((v) => (
                <VoucherCard
                  key={v.voucherId}
                  voucher={v}
                  darkMode={darkMode}
                  onView={() => {
                    dispatch(fetchVoucherByCode(v.code));
                    setShowViewModal(true);
                  }}
                  // onEdit={() => {
                  //   setEditingVoucher(v);
                  //   setShowFormModal(true);
                  // }}
                  onEdit={() => {}}
                  // onDelete={() => setInactiveId(v.voucherId)}
                  onDelete={() => {}}
                  onDuplicate={() => {}}
                  onImageClick={() => setLightboxImage({ image: v.imageUrl, alt: v.code })}
                />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <VoucherPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalElements}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Modal xác nhận vô hiệu hóa */}
      {inactiveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-center mb-4">Vô hiệu hóa voucher?</h3>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Voucher sẽ không thể sử dụng nữa.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setInactiveId(null)} className="px-5 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-xl">
                Hủy
              </button>
              <button onClick={() => {
                dispatch(inactiveVoucher(inactiveId));
                setInactiveId(null);
              }} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl">
                Vô hiệu hóa
              </button>
            </div>
          </div>
        </div>
      )}

      {lightboxImage && <ImageLightbox {...lightboxImage} onClose={() => setLightboxImage(null)} />}
      {showFormModal && <VoucherFormModal darkMode={darkMode} voucher={editingVoucher} onClose={() => { setShowFormModal(false); setEditingVoucher(null); }} />}
      {showViewModal && selectedVoucher && <ViewVoucherModal darkMode={darkMode} voucher={selectedVoucher} onClose={() => setShowViewModal(false)} />}
    </div>
  );
}
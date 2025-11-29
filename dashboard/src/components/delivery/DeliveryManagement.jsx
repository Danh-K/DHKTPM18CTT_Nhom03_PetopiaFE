"use client"

import { useCallback, useEffect, useState } from "react"
import DeliveryList from "./DeliveryList"
import { useDispatch } from 'react-redux';
import { fetchDeliveries, searchDeliveries } from "../../store/deliverySlice";
import { HiSearch } from "react-icons/hi";

export default function DeliveryManagement({ darkMode, onViewDetail }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("");
  const dispatch = useDispatch()

  const TranslateStatus = (vietnamese) => {
    const map = {
      "Chuẩn bị": "PREPARING",
      "Đã đóng gói": "SHIPPED",
      "Đang giao": "IN_TRANSIT",
      "Đã giao hàng": "DELIVERED",
      "Đã trả hàng": "RETURNED",
      "Giao thất bại": "FAILED"
    };
    return map[vietnamese] || "";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadData = useCallback(() => {
    const englishStatus = statusFilter ? TranslateStatus(statusFilter) : null;

    if (!debouncedQuery.trim() && !englishStatus) {
      dispatch(fetchDeliveries({ page: 0, size: 9 }));
    } else {
      dispatch(searchDeliveries({
        query: debouncedQuery.trim() || undefined,
        status: englishStatus || undefined,
        page: 0,
        size: 9
      }));
    }
  }, [dispatch, debouncedQuery, statusFilter]);

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-[#7b4f35] font-bold">Quản lý lịch sử giao hàng</h1>
      </div>

      {/* Search Bar */}
      <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Ô tìm kiếm */}
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã vận chuyển, tên, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-10 py-2 rounded-lg border transition-all ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-600"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              } outline-none`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                ×
              </button>
            )}
          </div>

          {/* Dropdown lọc trạng thái*/}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-900"
            } focus:border-orange-600 outline-none`}
          >
            <option value="">Trạng thái</option>
            <option value="Chuẩn bị">Chuẩn bị</option>
            <option value="Đã đóng gói">Đã đóng gói</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Đã giao hàng">Đã giao hàng</option>
            <option value="Đã trả hàng">Đã trả hàng</option>
            <option value="Giao thất bại">Giao thất bại</option>
          </select>
        </div>

        {/* Hiển thị đang lọc gì */}
        {(debouncedQuery || statusFilter) && (
          <div className="mt-3 text-sm text-gray-600">
            Đang hiển thị theo từ khóa: 
            {debouncedQuery && <span className="font-semibold text-orange-600"> "{debouncedQuery}"</span>}
            {statusFilter && <span className="font-semibold text-orange-600"> {statusFilter}</span>}
          </div>
        )}
      </div>

      <div className="animate-fadeIn">
        <DeliveryList darkMode={darkMode} onViewDetail={onViewDetail}/>
      </div>
    </div>
  )
}

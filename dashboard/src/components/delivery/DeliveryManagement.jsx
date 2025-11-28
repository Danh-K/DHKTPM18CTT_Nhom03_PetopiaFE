"use client"

import { useCallback, useEffect, useState } from "react"
import DeliveryList from "./DeliveryList"
import { useDispatch } from 'react-redux';
import { fetchDeliveries, searchDeliveries } from "../../store/deliverySlice";
import { HiSearch } from "react-icons/hi";

export default function DeliveryManagement({ darkMode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadData = useCallback(() => {
    if (debouncedQuery.trim() === "") {
      dispatch(fetchDeliveries({ page: 0, size: 9 }))
    } else {
      dispatch(searchDeliveries({ query: debouncedQuery, page: 0, size: 9 }))
    }
  }, [dispatch, debouncedQuery])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý lịch sử giao hàng</h1>
      </div>

      {/* Search Bar */}
      <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã vận đơn, tên hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-600"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              } outline-none`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {debouncedQuery && (
          <div className="mt-3 text-sm text-gray-600">
            Đang tìm kiếm: <span className="font-semibold text-orange-600">"{debouncedQuery}"</span>
          </div>
        )}
      </div>

      <div className="animate-fadeIn">
        <DeliveryList darkMode={darkMode} />
      </div>
    </div>
  )
}

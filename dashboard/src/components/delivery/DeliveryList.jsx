"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import DeliveryCard from "./DeliveryCard"
import { fetchDeliveries } from "../../store/deliverySlice"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"

export default function DeliveryList({ darkMode = false, onViewDetail }) {
  const dispatch = useDispatch()
  const {
    deliveries,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements
  } = useSelector((state) => state.delivery)

    useEffect(() => {
        dispatch(fetchDeliveries({ page: 0, size: 9 }))
    }, [dispatch])

    const goToPage = async (page) => {
        if (page >= 0 && page < totalPages && page !== currentPage) {
            dispatch(fetchDeliveries({ page, size: 9 }))
        }
    }

  const handlePrev = () => goToPage(currentPage - 1)
  const handleNext = () => goToPage(currentPage + 1)

  if (loading && deliveries.length === 0) {
    return (
      <div className={`flex justify-center items-center py-16 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Đang tải đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-16 text-red-600 font-semibold">{error}</div>
  }

  if (deliveries.length === 0) {
    return <div className="text-center py-16 text-gray-500 text-lg">Chưa có đơn hàng nào</div>
  }

  return (
    <div className="space-y-8">
      {/* Grid 9 card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveries.map((delivery) => (
          <div
            key={delivery.deliveryId}
            onClick={() => onViewDetail(delivery.deliveryId)}
            className="cursor-pointer transition-all hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden"
          >
            <DeliveryCard delivery={delivery} darkMode={darkMode} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className={`text-center text-lg ${darkMode ? "text-gray-500" : "text-gray-600"}`}>
            Hiển thị {(currentPage * 9) + 1} - {Math.min((currentPage + 1) * 9, totalElements)} trong tổng số {totalElements} đơn hàng
          </div>
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className={`p-3 rounded-xl flex transition-all ${
                currentPage === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-md"
              }`}
            >
              <HiChevronLeft className="w-5 h-5" /> Trước
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`w-12 h-12 rounded-xl font-medium transition-all ${
                    currentPage === i
                      ? "bg-[#7b4f35] text-white shadow-lg scale-110"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } ${darkMode ? "dark:bg-gray-800" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1}
              className={`p-3 rounded-xl flex transition-all ${
                currentPage >= totalPages - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-md"
              }`}
            >
              Tiếp <HiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
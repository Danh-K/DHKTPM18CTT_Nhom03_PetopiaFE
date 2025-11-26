import { HiTrendingUp } from "react-icons/hi";

export default function PromotionStatsCards({ darkMode, active, total, avg }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Khuyến mãi Hoạt động</p>
            <p className="text-3xl font-bold text-green-600">{active}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <HiTrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Tổng Khuyến mãi</p>
            <p className="text-3xl font-bold text-blue-600">{total}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Giảm giá TB</p>
            <p className="text-3xl font-bold text-orange-600">{avg}%</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
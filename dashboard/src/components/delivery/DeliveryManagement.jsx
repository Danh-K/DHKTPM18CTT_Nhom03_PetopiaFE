"use client"

import { useState } from "react"
import DeliveryList from "./DeliveryList"

export default function DeliveryManagement({ darkMode }) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý lịch sử giao hàng</h1>
      </div>

      {/* Search Bar */}
      <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-3 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-600"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              } outline-none`}
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="animate-fadeIn">
        <DeliveryList darkMode={darkMode} />
      </div>
    </div>
  )
}

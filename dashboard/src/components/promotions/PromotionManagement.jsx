"use client"

import { useState } from "react"
import VoucherList from "./VoucherList"
import PromotionList from "./PromotionList"

export default function PromotionManagement({ darkMode }) {
  const [activeTab, setActiveTab] = useState("promotion")

  return (
    <div className="space-y-6">
      {/* Beautiful Tab Switcher with Segmented Control Style */}
      <div className="flex justify-center">
        <div className={`inline-flex p-1 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
          <div className="relative flex gap-1">
            {/* Sliding Background Indicator */}
            <div
              className={`absolute top-1 bottom-1 rounded-lg bg-[#7b4f35] transition-all duration-300 ease-out ${
                activeTab === "promotion" ? "left-1 right-[calc(50%+2px)]" : "left-[calc(50%+2px)] right-1"
              }`}
            />
                        {/* Promotion Tab */}
            <button
              onClick={() => setActiveTab("promotion")}
              className={`relative z-10 px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === "promotion"
                  ? "text-white"
                  : darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-[#7b4f35]"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Khuyến mãi
              </span>
            </button>

            {/* Voucher Tab */}
            <button
              onClick={() => setActiveTab("voucher")}
              className={`relative z-10 px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === "voucher"
                  ? "text-white"
                  : darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-[#7b4f35]"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
                Voucher
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="animate-fadeIn">
        {activeTab === "voucher" ? <VoucherList darkMode={darkMode} /> : <PromotionList darkMode={darkMode} />}
      </div>
    </div>
  )
}
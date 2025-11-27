"use client"

import { HiOutlineClipboardDocumentList, HiOutlineArchiveBox, HiOutlineTruck, HiOutlineCheckCircle,} from "react-icons/hi2"

const steps = [
  { status: "Chuẩn bị", icon: HiOutlineClipboardDocumentList, activeColor: "text-blue-600", bgActive: "bg-blue-100" },
  { status: "Đã đóng gói", icon: HiOutlineArchiveBox, activeColor: "text-purple-600", bgActive: "bg-purple-100" },
  { status: "Đang giao", icon: HiOutlineTruck, activeColor: "text-orange-600", bgActive: "bg-orange-100" },
  { status: "Đã giao hàng", icon: HiOutlineCheckCircle, activeColor: "text-green-600",  bgActive: "bg-green-100" },
]

export default function DeliveryTimeline({ currentStatus }) {
  const activeIndex = steps.findIndex(s => s.status === currentStatus || currentStatus.includes(s.status))

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = activeIndex >= index
          const isCurrent = activeIndex === index
          const Icon = step.icon

          return (
            <div key={index} className="flex flex-col items-center z-10 flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? `${step.bgActive} ${step.activeColor} shadow-lg ring-4 ring-orange-400 ring-opacity-30`
                    : "bg-gray-200 text-gray-400"
                } ${isCurrent ? "scale-110" : ""}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p
                className={`mt-2 text-xs font-semibold transition-all ${
                  isActive ? "text-orange-600" : "text-gray-500"
                }`}
              >
                {step.status}
              </p>
            </div>
          )
        })}
      </div>

      <div className="absolute top-6 left-6 right-6 h-1 bg-gray-300 rounded-full -z-10" />

      <div
        className="absolute top-6 left-6 h-1 bg-orange-500 rounded-full transition-all duration-700 ease-in-out -z-10"
        style={{
          width: activeIndex >= 0 
            ? `${(activeIndex / (steps.length - 1)) * 100}%` 
            : "0%"
        }}
      />
    </div>
  )
}
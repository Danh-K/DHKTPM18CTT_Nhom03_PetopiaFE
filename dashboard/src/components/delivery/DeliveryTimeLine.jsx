"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { updateDeliveryStatus } from "../../store/deliverySlice"
import { HiOutlineClipboardDocumentList, HiOutlineArchiveBox, HiOutlineTruck, HiOutlineCheckCircle, HiMiniChevronRight } from "react-icons/hi2"

const steps = [
  { status: "Chuẩn bị", value: "PREPARING", icon: HiOutlineClipboardDocumentList, color: "text-blue-600", bg: "bg-blue-100" },
  { status: "Đã đóng gói", value: "SHIPPED", icon: HiOutlineArchiveBox, color: "text-purple-600", bg: "bg-purple-100" },
  { status: "Đang giao", value: "IN_TRANSIT", icon: HiOutlineTruck, color: "text-orange-600", bg: "bg-orange-100" },
  { status: "Đã giao hàng", value: "DELIVERED", icon: HiOutlineCheckCircle, color: "text-green-600", bg: "bg-green-100" },
]

export default function DeliveryTimeline({ currentStatus, delivery }) {
  const dispatch = useDispatch()
  const [isUpdating, setIsUpdating] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const activeIndex = steps.findIndex(s => 
    s.status === currentStatus || 
    (typeof currentStatus === "string" && currentStatus.includes(s.status))
  )

  const nextStepIndex = activeIndex >= 0 && activeIndex < steps.length - 1 ? activeIndex + 1 : -1
  const nextStep = nextStepIndex !== -1 ? steps[nextStepIndex] : null

  const handleClick = () => {
    if (!nextStep || isUpdating) return
    setShowConfirm(true)
  }

  const confirmUpdate = async () => {
    setShowConfirm(false)
    setIsUpdating(true)
    try {
      await dispatch(updateDeliveryStatus({
        deliveryId: delivery.deliveryId,
        status: nextStep.value
      })).unwrap()
    } catch (error) {
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineTruck className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận chuyển trạng thái</h3>
              <p className="text-gray-600">
                Chuyển sang <span className="font-bold text-orange-600">{nextStep.status}</span>?
              </p>
            </div>
            <div className="flex border-t">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-4 text-gray-600 font-medium hover:bg-gray-100 rounded-bl-2xl transition"
              >
                Hủy
              </button>
              <button
                onClick={confirmUpdate}
                className="flex-1 py-4 bg-orange-600 text-white font-medium hover:bg-orange-700 rounded-br-2xl transition"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = activeIndex >= index
            const isCurrent = activeIndex === index
            const isNext = index === nextStepIndex
            const Icon = step.icon

            return (
                <div key={index} className="flex items-center flex-1">
                    <button
                        key={index}
                        onClick={handleClick}
                        disabled={!isNext || isUpdating}
                        className={`flex flex-col items-center transition-all duration-300 flex-1
                        ${isNext && !isUpdating ? "cursor-pointer hover:scale-110" : "cursor-not-allowed"}
                        ${isActive ? "" : "opacity-50"}
                        `}
                    >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg relative transition-all
                            ${isActive 
                            ? `${step.bg} ${step.color} ring-4 ring-orange-400 ring-opacity-40` 
                            : "bg-gray-200 text-gray-400"
                            }
                            ${isCurrent ? "animate-pulse" : ""}
                            ${isNext ? "ring-8 ring-orange-500 ring-opacity-70 shadow-orange-300" : ""}
                        `}
                        >
                        {isUpdating && isNext && (
                            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-white animate-spin" />
                        )}
                        <Icon className="w-7 h-7 relative z-10" />
                        </div>

                        <p className={`mt-2 text-[9px] font-bold transition-all
                        ${isActive ? step.color : "text-gray-500"}
                        `}>
                        {step.status}
                        </p>
                    </button>
                    {index < steps.length - 1 && (
                        <div className="flex-1 flex flex-col items-center">
                            <HiMiniChevronRight className={`w-4 h-4 
                            ${isActive ? "text-orange-500" : "text-gray-400"}`} 
                            />
                            <p className="text-[1px] h-4"></p> {/* khoảng trống giữa các p */}
                        </div>
                    )}
                </div>
            )
          })}
          
        </div>

      </div>
    </>
  )
}
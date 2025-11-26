'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import axiosInstance from '@/lib/utils/axios'
import useSWR from 'swr'
import { Loading } from '@/app/components/loading'
import type { Order } from '@/types/Order'
import { CheckCircle, Copy, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hook/useToast'

const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url)
  return response.data
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string
  const [copied, setCopied] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const { success, ToastContainer } = useToast()

  // Fetch order detail
  const { data: orderData, error, isLoading } = useSWR<{ data: Order }>(
    orderId ? `/orders/${orderId}` : null,
    fetcher,
    {
      refreshInterval: 5000 // Auto refresh mỗi 5s để check payment status
    }
  )

  const order = orderData?.data

  // Redirect nếu đã thanh toán thành công
  useEffect(() => {
    if (order?.paymentStatus === 'PAID') {
      router.push(`/orders`)
    }
  }, [order, router])

  const handleCopyContent = () => {
    if (order?.transactionId) {
      navigator.clipboard.writeText(order.transactionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    success('Đã sao chép!', `${label} đã được sao chép vào clipboard.`)
  }

  const handleCancel = () => {
    setShowCancelModal(true)
  }

  const handleConfirmCancel = () => {
    setShowCancelModal(false)
    success('Hủy thành công', 'Giao dịch đã được hủy.')
    setTimeout(() => {
      router.push('/pets')
    }, 1000)
  }

  const handleCloseModal = () => {
    setShowCancelModal(false)
  }

  if (isLoading) return <Loading />
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi tải thông tin đơn hàng</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button
            onClick={() => router.push('/orders')}
            className="bg-[#7B4F35] text-white px-6 py-3 rounded-full hover:bg-[#A0694B] transition-colors"
          >
            Quay lại đơn hàng
          </button>
        </div>
      </div>
    )
  }

  if (!order) return null

  // Nếu không phải BANK_TRANSFER hoặc không có paymentUrl
  if (order.paymentMethod !== 'BANK_TRANSFER' || !order.paymentUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Đơn hàng không cần thanh toán online</h2>
          <button
            onClick={() => router.push('/orders')}
            className="bg-[#7B4F35] text-white px-6 py-3 rounded-full hover:bg-[#A0694B] transition-colors"
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
      
      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        {/* Instruction */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex gap-3">
          <div className="text-2xl">💡</div>
          <div className="text-sm text-gray-700">
            Mở App Ngân hàng bất kỳ để <strong>quét mã VietQR</strong> hoặc{' '}
            <strong>chuyển khoản</strong> chính xác số tiền, nội dung bên dưới
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - QR Code */}
            <div className="flex flex-col items-center">
              {/* VietQR PRO Logo */}
              <div className="flex items-center gap-2 mb-6">
                <div className="text-red-600 font-bold text-2xl">VIET</div>
                <div className="text-gray-800 font-bold text-2xl">QR</div>
                <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">PRO</div>
              </div>

              {/* QR Code */}
              <div className="relative mb-4">
                <Image
                  src={order.paymentUrl}
                  alt="QR Code"
                  width={280}
                  height={280}
                  className="rounded-lg border-2 border-gray-200"
                  unoptimized
                />
                {/* Bank Logo in Center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">ICB</span>
                  </div>
                </div>
              </div>

              {/* Bank Logos */}
              <div className="flex justify-center gap-4">
                <div className="text-xs text-blue-600 font-semibold">napas 24/7</div>
                <div className="text-xs text-blue-600 font-bold">ICB</div>
              </div>
            </div>

            {/* Right Column - Payment Details */}
            <div className="space-y-4">
              {/* Bank Info Header */}
              <div className="flex items-start gap-3 pb-4 border-b">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">ICB</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Ngân hàng</div>
                  <div className="font-semibold text-gray-800">{order.bankName || 'Ngân hàng TMCP Công Thương Việt Nam'}</div>
                </div>
              </div>

              {/* Account Name */}
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Chủ tài khoản:</div>
                  <div className="font-semibold text-gray-800">{order.accountName || 'NGUYEN DUC HAU'}</div>
                </div>
                <button
                  onClick={() => handleCopy(order.accountName || 'NGUYEN DUC HAU', 'Tên chủ tài khoản')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer"
                >
                  Sao chép
                </button>
              </div>

              {/* Account Number */}
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Số tài khoản:</div>
                  <div className="font-semibold text-gray-800">{order.accountNo || '109876820087'}</div>
                </div>
                <button
                  onClick={() => handleCopy(order.accountNo || '109876820087', 'Số tài khoản')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer"
                >
                  Sao chép
                </button>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Số tiền:</div>
                  <div className="font-semibold text-gray-800">{order.totalAmount.toLocaleString('vi-VN')} vnd</div>
                </div>
                <button
                  onClick={() => handleCopy(order.totalAmount.toString(), 'Số tiền')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer"
                >
                  Sao chép
                </button>
              </div>

              {/* Content */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Nội dung:</div>
                  <div className="font-semibold text-gray-800 break-all">{order.transactionId}</div>
                </div>
                <button
                  onClick={() => handleCopy(order.transactionId || '', 'Nội dung')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors ml-2 cursor-pointer"
                >
                  Sao chép
                </button>
              </div>
            </div>
          </div>

          {/* Note Below */}
          <div className="mt-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Lưu ý :</strong> Nhập chính xác số tiền <strong>{order.totalAmount.toLocaleString('vi-VN')}</strong>, nội dung{' '}
                <strong>{order.transactionId}</strong> khi chuyển khoản
              </p>
            </div>
          </div>

          {/* Cancel Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleCancel}
              className="px-16 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Payment Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(72, 72, 72, 0.3)' }}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg border border-gray-300 shadow-xl p-6 w-full max-w-md mx-4">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              HỦY
            </h3>
            
            {/* Message */}
            <p className="text-gray-700 mb-6 text-center">
              Quý khách có chắc chắn muốn hủy giao dịch này?
            </p>
            
            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gray-100 border border-gray-400 text-gray-700 font-normal rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-normal rounded-lg transition-colors cursor-pointer"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


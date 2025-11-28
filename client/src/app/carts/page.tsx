'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { useCart } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hook/useToast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axiosInstance from '@/lib/utils/axios'
import useSWR from 'swr'
import type { PromotionResponse } from '@/types/Promotion'
import type { User } from '@/types/User'
import type { Address } from '@/types/Address'
import type { Order } from '@/types/Order'

// Fetcher for SWR
const fetcher = async (url: string) => {
  const response = await axiosInstance.get(url)
  return response.data
}

// Districts by province (moved outside component to avoid re-creation)
const districtsByProvince: { [key: string]: string[] } = {
  'hcm': [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 
    'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Quận Bình Tân', 'Quận Bình Thạnh', 
    'Quận Gò Vấp', 'Quận Phú Nhuận', 'Quận Tân Bình', 'Quận Tân Phú', 'Quận Thủ Đức',
    'Huyện Bình Chánh', 'Huyện Cần Giờ', 'Huyện Củ Chi', 'Huyện Hóc Môn', 'Huyện Nhà Bè'
  ],
  'dongnai': [
    'Thành phố Biên Hòa', 'Thành phố Long Khánh', 'Huyện Cẩm Mỹ', 'Huyện Định Quán', 
    'Huyện Long Thành', 'Huyện Nhơn Trạch', 'Huyện Thống Nhất', 'Huyện Trảng Bom', 
    'Huyện Vĩnh Cửu', 'Huyện Xuân Lộc', 'Huyện Tân Phú'
  ],
  'khanhhoa': [
    'Thành phố Nha Trang', 'Thành phố Cam Ranh', 'Thị xã Ninh Hòa', 'Huyện Cam Lâm', 
    'Huyện Diên Khánh', 'Huyện Khánh Sơn', 'Huyện Khánh Vĩnh', 'Huyện Trường Sa', 
    'Huyện Vạn Ninh'
  ],
  'hanoi': [
    'Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Tây Hồ', 'Quận Long Biên', 'Quận Cầu Giấy', 
    'Quận Đống Đa', 'Quận Hai Bà Trưng', 'Quận Hoàng Mai', 'Quận Thanh Xuân', 'Quận Hà Đông', 
    'Quận Nam Từ Liêm', 'Quận Bắc Từ Liêm', 'Huyện Ba Vì', 'Huyện Chương Mỹ', 'Huyện Đan Phượng', 
    'Huyện Đông Anh', 'Huyện Gia Lâm', 'Huyện Hoài Đức', 'Huyện Mê Linh', 'Huyện Mỹ Đức', 
    'Huyện Phú Xuyên', 'Huyện Phúc Thọ', 'Huyện Quốc Oai', 'Huyện Sóc Sơn', 'Huyện Thạch Thất', 
    'Huyện Thanh Oai', 'Huyện Thanh Trì', 'Huyện Thường Tín', 'Huyện Ứng Hòa', 'Thị xã Sơn Tây'
  ],
  'ninhthuan': [
    'Thành phố Phan Rang-Tháp Chàm', 'Huyện Bác Ái', 'Huyện Ninh Hải', 'Huyện Ninh Phước', 
    'Huyện Ninh Sơn', 'Huyện Thuận Bắc', 'Huyện Thuận Nam'
  ]
}

const CartPage = () => {
  const { 
    items, 
    subtotal, 
    updateQuantity, 
    removeItem,
    calculateItemTotal,
    calculateItemSavings,
    clearCart
  } = useCart()

  // Auth state
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const { error, success, ToastContainer } = useToast()

  // Customer Info State
  const [customerInfo, setCustomerInfo] = useState({
    gender: 'male',
    fullName: '',
    phone: '',
    email: '',
    deliveryType: 'home',
    province: '',
    district: '',
    address: '',
    note: '',
    recipientGender: 'male',
    recipientName: '',
    recipientPhone: '',
    saveRecipient: false,
    paymentMethod: 'cash', // cash or bank
    selectedAddressId: '' // ID của địa chỉ được chọn (nếu có)
  })

  // Fetch user profile
  const { data: userProfile } = useSWR<{ data: User }>(
    isAuthenticated ? '/users/me' : null,
    fetcher
  )

  // Fetch user addresses
  const { data: userAddresses } = useSWR<{ data: Address[] }>(
    isAuthenticated ? '/users/addresses' : null,
    fetcher
  )

  // Auto-fill thông tin khách hàng khi có data từ API
  useEffect(() => {
    if (userProfile?.data) {
      const user = userProfile.data
      setCustomerInfo(prev => ({
        ...prev,
        fullName: user.fullName || '',
        phone: user.phoneNumber || '',
        email: user.email || ''
      }))
    }
  }, [userProfile])

  // Auto-fill địa chỉ mặc định khi có data từ API
  useEffect(() => {
    if (userAddresses?.data && userAddresses.data.length > 0) {
      // Tìm địa chỉ mặc định hoặc lấy địa chỉ đầu tiên
      const defaultAddress = userAddresses.data.find(addr => addr.isDefault) || userAddresses.data[0]
      
      if (defaultAddress) {
        const provinceValue = mapProvinceToValue(defaultAddress.province)
        
        // Tìm district match (case-insensitive) trong danh sách
        const availableDistricts = districtsByProvince[provinceValue] || []
        const matchedDistrict = availableDistricts.find(d => 
          d.toLowerCase() === (defaultAddress.district || '').toLowerCase()
        ) || defaultAddress.district || ''
        
        setCustomerInfo(prev => ({
          ...prev,
          selectedAddressId: defaultAddress.addressId,
          province: provinceValue,
          district: matchedDistrict,
          address: defaultAddress.street || ''
        }))
      }
    }
  }, [userAddresses])

  // Helper function để map tên tỉnh thành value
  const mapProvinceToValue = (provinceName: string): string => {
    const provinceMap: { [key: string]: string } = {
      'Thành phố Hồ Chí Minh': 'hcm',
      'Đồng Nai': 'dongnai',
      'Khánh Hòa': 'khanhhoa',
      'Hà Nội': 'hanoi',
      'Ninh Thuận': 'ninhthuan'
    }
    return provinceMap[provinceName] || 'hcm'
  }

  // Helper function để map value thành tên tỉnh
  const mapValueToProvince = (value: string): string => {
    const valueMap: { [key: string]: string } = {
      'hcm': 'Thành phố Hồ Chí Minh',
      'dongnai': 'Đồng Nai',
      'khanhhoa': 'Khánh Hòa',
      'hanoi': 'Hà Nội',
      'ninhthuan': 'Ninh Thuận'
    }
    return valueMap[value] || 'Thành phố Hồ Chí Minh'
  }

  // Voucher state (User nhập mã - CHỈ 1 VOUCHER)
  const [voucherCode, setVoucherCode] = useState('')
  const [appliedVoucher, setAppliedVoucher] = useState<{
    voucherId: string
    code: string
    description: string
    discountType: string
    discountValue: number
    discountAmount: number
  } | null>(null)
  const [voucherError, setVoucherError] = useState('')
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false)

  // Promotion state (User tự chọn - CHỈ 1 KHUYẾN MÃI)
  const { data: promotionsData } = useSWR<PromotionResponse>('/pets/promotions?page=0&size=100', fetcher)
  const [showPromotions, setShowPromotions] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null) // Chỉ chọn 1 promotion code

  // Tự động bỏ chọn promotion khi không còn đủ điều kiện
  useEffect(() => {
    if (selectedPromotion && promotionsData?.content) {
      const promo = promotionsData.content.find(p => p.code === selectedPromotion)
      if (promo && promo.minOrderAmount && subtotal < promo.minOrderAmount) {
        // Không đủ điều kiện nữa -> Bỏ chọn
        setSelectedPromotion(null)
      }
    }
  }, [subtotal, selectedPromotion, promotionsData])

  // Tự động bỏ chọn voucher khi không còn đủ điều kiện
  useEffect(() => {
    if (appliedVoucher && appliedVoucher.discountAmount > 0) {
      // Tính lại discount với subtotal mới
      let newDiscountAmount = 0
      const discountType = (appliedVoucher.discountType || '').toUpperCase()
      
      if (discountType === 'PERCENTAGE') {
        newDiscountAmount = (subtotal * (appliedVoucher.discountValue || 0)) / 100
      } else if (discountType === 'FIXED_AMOUNT') {
        newDiscountAmount = appliedVoucher.discountValue || 0
      }
      
      // Cập nhật lại discountAmount
      if (newDiscountAmount !== appliedVoucher.discountAmount) {
        setAppliedVoucher({
          ...appliedVoucher,
          discountAmount: newDiscountAmount
        })
      }
    }
  }, [subtotal, appliedVoucher])

  // Tính giảm giá từ Promotion đã chọn
  const promotionDiscount: number = (() => {
    if (!promotionsData?.content || !selectedPromotion) return 0
    
    const promo = promotionsData.content.find(p => p.code === selectedPromotion)
    if (!promo || !promo.discountValue) return 0
    
    // Kiểm tra điều kiện minOrderAmount
    if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
      return 0 // Không đủ điều kiện
    }
    
    // Backend logic: Nếu discountValue <= 100 VÀ promotionType = 'DISCOUNT' thì giảm theo %
    // Ngược lại, giảm cố định bằng discountValue
    if (promo.promotionType === 'DISCOUNT' && promo.discountValue <= 100) {
      // Giảm theo %
      return (subtotal * promo.discountValue) / 100
    } else {
      // Giảm cố định (áp dụng cho mọi trường hợp còn lại)
      return promo.discountValue
    }
  })()

  // Tính tổng giảm giá từ Voucher đã apply
  const voucherDiscount = appliedVoucher ? appliedVoucher.discountAmount : 0

  // Tổng discount = promotion đã chọn + voucher
  const totalDiscount = promotionDiscount + voucherDiscount

  const handleApplyVoucher = async () => {
    setVoucherError('')
    
    if (!voucherCode.trim()) {
      setVoucherError('Vui lòng nhập mã voucher')
      return
    }

    // Check nếu đã có voucher
    if (appliedVoucher) {
      setVoucherError('Chỉ được áp dụng 1 voucher. Vui lòng xóa voucher hiện tại trước.')
      return
    }

    setIsApplyingVoucher(true)
    
    try {
      const response = await axiosInstance.post('/pets/vouchers/apply', {
        voucherCode: voucherCode.trim(),
        orderAmount: subtotal
      })

      const voucher = response.data
      
      // Kiểm tra response có dữ liệu hợp lệ không
      if (!voucher || !voucher.voucherId || !voucher.code) {
        setVoucherError('Mã voucher không hợp lệ hoặc không áp dụng được cho đơn hàng này')
        return
      }
      
      // Tính discountAmount
      let discountAmount = 0
      const discountType = (voucher.discountType || '').toUpperCase()
      
      if (discountType === 'PERCENTAGE') {
        discountAmount = (subtotal * (voucher.discountValue || 0)) / 100
      } else if (discountType === 'FIXED_AMOUNT') {
        discountAmount = voucher.discountValue || 0
      }
      
      // Lưu voucher (chỉ 1)
      setAppliedVoucher({
        voucherId: voucher.voucherId,
        code: voucher.code,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        discountAmount: discountAmount
      })
      
      setVoucherCode('')
      setVoucherError('')
      success('Thành công', `Đã áp dụng voucher ${voucher.code}`)
      
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: { message?: string } }; message?: string }
      console.error('Error applying voucher:', error)
      
      // Hiển thị thông báo lỗi từ backend (nếu có)
      if (error.response?.data?.message) {
        setVoucherError(error.response.data.message)
      } else if (error.response?.status === 204) {
        setVoucherError('Mã voucher không hợp lệ hoặc không áp dụng được cho đơn hàng này')
      } else if (error.response?.status === 400) {
        setVoucherError('Đơn hàng không đủ điều kiện áp dụng mã này')
      } else if (error.response?.status === 404) {
        setVoucherError('Mã voucher không tồn tại')
      } else {
        setVoucherError('Mã voucher không hợp lệ. Vui lòng kiểm tra lại.')
      }
    } finally {
      setIsApplyingVoucher(false)
    }
  }

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null)
  }

  const handleSelectPromotion = (promoCode: string) => {
    if (selectedPromotion === promoCode) {
      // Bỏ chọn nếu click lại vào cái đang chọn
      setSelectedPromotion(null)
    } else {
      // Chọn promotion mới (thay thế cái cũ)
      setSelectedPromotion(promoCode)
    }
  }

  const shippingFee: number = 0 // Miễn phí vận chuyển
  const finalTotal = Math.max(0, subtotal - totalDiscount + shippingFee)

  // Handle checkout
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      error('Chưa đăng nhập', 'Vui lòng đăng nhập để tiếp tục')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
      return
    }

    // Validate thông tin
    if (!customerInfo.fullName.trim()) {
      error('Lỗi', 'Vui lòng nhập họ và tên')
      return
    }

    if (!customerInfo.phone.trim()) {
      error('Lỗi', 'Vui lòng nhập số điện thoại')
      return
    }

    if (!customerInfo.email.trim()) {
      error('Lỗi', 'Vui lòng nhập email')
      return
    }

    if (customerInfo.deliveryType === 'home') {
      if (!customerInfo.province) {
        error('Lỗi', 'Vui lòng chọn tỉnh thành')
        return
      }
      if (!customerInfo.district) {
        error('Lỗi', 'Vui lòng chọn phường xã')
        return
      }
      if (!customerInfo.address.trim()) {
        error('Lỗi', 'Vui lòng nhập địa chỉ')
        return
      }
    }

    if (customerInfo.saveRecipient) {
      if (!customerInfo.recipientName.trim()) {
        error('Lỗi', 'Vui lòng nhập tên người nhận')
        return
      }
      if (!customerInfo.recipientPhone.trim()) {
        error('Lỗi', 'Vui lòng nhập số điện thoại người nhận')
        return
      }
    }

    if (items.length === 0) {
      error('Lỗi', 'Giỏ hàng trống')
      return
    }

    try {
      // Chuẩn bị data để gửi lên backend
      const orderData: {
        phoneNumber: string;
        recipientName: string;
        note: string;
        paymentMethod: string;
        items: { petId: string; quantity: number }[];
        voucherIds?: string[]; // Thêm danh sách voucher IDs
        addressId?: string;
        newProvince?: string;
        newDistrict?: string;
        newWard?: string;
        newStreet?: string;
      } = {
        phoneNumber: customerInfo.saveRecipient ? customerInfo.recipientPhone : customerInfo.phone,
        recipientName: customerInfo.saveRecipient ? customerInfo.recipientName : customerInfo.fullName,
        note: customerInfo.note || '',
        paymentMethod: customerInfo.paymentMethod === 'cash' ? 'COD' : 'BANK_TRANSFER',
        items: items.map(item => ({
          petId: item.pet.petId,
          quantity: item.quantity
        })),
        // Gửi voucher ID (nếu có)
        voucherIds: appliedVoucher ? [appliedVoucher.voucherId] : undefined
      }

      // Xử lý địa chỉ
      if (customerInfo.deliveryType === 'store') {
        // Nhận tại cửa hàng - dùng địa chỉ cửa hàng
        orderData.newProvince = 'Thành phố Hồ Chí Minh'
        orderData.newDistrict = 'Quận Gò Vấp'
        orderData.newWard = 'P. Hạnh Thông'
        orderData.newStreet = 'Số 12 Nguyễn Văn Bảo'
      } else {
        // Giao hàng tận nơi
        // Kiểm tra xem có chọn địa chỉ có sẵn không
        const hasExistingAddress = userAddresses?.data && userAddresses.data.length > 0 && customerInfo.selectedAddressId
        
        // Kiểm tra xem địa chỉ đã được thay đổi so với địa chỉ mặc định không
        const defaultAddress = userAddresses?.data?.find(addr => addr.addressId === customerInfo.selectedAddressId)
        const isAddressChanged = defaultAddress && (
          mapProvinceToValue(defaultAddress.province) !== customerInfo.province ||
          (defaultAddress.district || '') !== customerInfo.district ||
          (defaultAddress.street || '') !== customerInfo.address
        )

        // Nếu địa chỉ đã thay đổi hoặc không có địa chỉ nào, tạo địa chỉ mới
        if (!hasExistingAddress || isAddressChanged) {
          orderData.newProvince = mapValueToProvince(customerInfo.province)
          orderData.newDistrict = customerInfo.district
          orderData.newWard = customerInfo.district // Backend lưu ward = district
          orderData.newStreet = customerInfo.address
        } else {
          // Sử dụng địa chỉ có sẵn
          orderData.addressId = customerInfo.selectedAddressId
        }
      }

      // Gửi request lên backend
      const response = await axiosInstance.post<{ status: number; message: string; data: Order }>('/orders', orderData)

      const orderResult = response.data.data

      // Hiển thị thông báo thành công
      success('Đặt hàng thành công', 'Đơn hàng của bạn đã được tạo thành công')

      // Clear giỏ hàng
      clearCart()

      // Kiểm tra phương thức thanh toán
      if (orderResult.paymentMethod === 'BANK_TRANSFER' && orderResult.paymentUrl) {
        // Redirect đến trang thanh toán SePay ngay lập tức
        setTimeout(() => {
          router.push(`/payment/${orderResult.orderId}`)
        }, 1500)
      } else {
        // COD: Redirect đến trang đơn hàng
        setTimeout(() => {
          router.push('/orders')
        }, 2000)
      }

    } catch (err: unknown) {
      const error_ = err as { response?: { data?: { message?: string }; status?: number }; message?: string }
      console.error('❌ Checkout Error:', err)
      
      if (error_.response?.status === 401) {
        error('Lỗi xác thực', 'Vui lòng đăng nhập lại')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else if (error_.response?.data?.message) {
        error('Lỗi', error_.response.data.message)
      } else {
        error('Lỗi', 'Không thể tạo đơn hàng. Vui lòng thử lại sau')
      }
    }
  }

  const getDistricts = () => {
    if (customerInfo.deliveryType === 'store') {
      return ['P. Hạnh Thông']
    }
    return districtsByProvince[customerInfo.province] || []
  }

  // Check xem có đang chọn địa chỉ mặc định không (để hiển thị label)
  const isDefaultAddressSelected = customerInfo.deliveryType === 'home' && 
    customerInfo.selectedAddressId !== '' &&
    !!(userAddresses?.data?.find(addr => addr.addressId === customerInfo.selectedAddressId)?.isDefault)

  // Check xem có đang chọn 1 địa chỉ có sẵn không (để disable các trường)
  // CHỈ enable khi chọn "Nhập địa chỉ khác" (selectedAddressId = '')
  const isAddressFieldsDisabled = customerInfo.deliveryType === 'home' && customerInfo.selectedAddressId !== ''

  const handleUpdateQuantity = (petId: string, change: number) => {
    const item = items.find(i => i.pet.petId === petId)
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change)
      updateQuantity(petId, newQuantity)
    }
  }

  const handleRemoveItem = (petId: string) => {
    removeItem(petId)
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-white">
        {/* Cart Title */}
        <div className="relative py-24">
          <div className="absolute inset-0">
            <Image 
              src="/assets/imgs/imgBackgroundTitle/bc-blog-listing.jpg"
              alt="Cart Background"
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <h1 
              className="text-center font-bold text-6xl text-white drop-shadow-lg"
            >
              Giỏ hàng
            </h1>
          </div>
        </div>

      {items.length === 0 ? (
        // Empty cart - hiển thị SVG và text
        <div className="container mx-auto px-4 py-20 max-w-7xl">
          <div className="flex flex-col items-center justify-center">
            {/* Sad Face Icon */}
            <div className="mb-8">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="120" 
                height="120" 
                fill="none"
                className="text-[#A0694B]"
              >
                <path 
                  fill="currentColor" 
                  d="M60 0C26.863 0 0 26.863 0 60s26.863 60 60 60 60-26.863 60-60S93.137 0 60 0Zm19.355 40.645a7.742 7.742 0 0 1 7.742 7.742 7.742 7.742 0 0 1-7.742 7.742 7.742 7.742 0 0 1-7.742-7.742 7.742 7.742 0 0 1 7.742-7.742ZM36.774 98.71c-6.41 0-11.613-5.081-11.613-11.355 0-4.84 6.892-14.606 10.065-18.806a1.927 1.927 0 0 1 3.096 0c3.173 4.2 10.065 13.966 10.065 18.806 0 6.274-5.203 11.355-11.613 11.355Zm3.871-42.581a7.742 7.742 0 0 1-7.742-7.742 7.742 7.742 0 0 1 7.742-7.742 7.742 7.742 0 0 1 7.742 7.742 7.742 7.742 0 0 1-7.742 7.742Zm41.161 37.29A28.403 28.403 0 0 0 60 83.226c-5.129 0-5.129-7.742 0-7.742a36.013 36.013 0 0 1 27.742 13.032c3.337 3.968-2.71 8.826-5.936 4.903Z"
                />
              </svg>
            </div>
            
            {/* Empty Cart Text */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-600 mb-4">Giỏ hàng rỗng</h2>
              <p className="text-gray-500 text-lg mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
              <Link href="/pets">
                <button className="bg-[#7B4F35] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#A0694B] transition-colors shadow-lg">
                  Tiếp tục mua sắm
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // Cart có sản phẩm - hiển thị đầy đủ
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Cart Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            {/* Table Header */}
            <div className="bg-[#7B4F35] text-white grid grid-cols-12 gap-4 px-6 py-4 font-bold text-xl">
              <div className="col-span-1 pr-6 whitespace-nowrap">Sản phẩm</div>
              <div className="col-span-7 border-l border-white/30 px-6">Chi tiết</div>
              <div className="col-span-4 text-center border-l border-white/30 pl-6">Tổng</div>
            </div>

            {/* Cart Items */}
            {items.map(item => {
              const pet = item.pet
              const currentPrice = pet.discountPrice || pet.price
              const hasDiscount = pet.discountPrice && pet.discountPrice < pet.price
              
              return (
                <div key={pet.petId} className="grid grid-cols-12 gap-4 px-6 py-6 border-b border-gray-200 items-start">
                  {/* Product */}
                  <div className="col-span-1 flex items-start pr-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <Image
                        src={item.img || pet.mainImageUrl || '/assets/imgs/placeholder.png'}
                        alt={pet.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="col-span-7 border-l border-gray-200 px-6 flex items-center justify-between">
                    <div>
                      <Link href={`/pets/${pet.petId}`}>
                        <h3 className="text-xl font-bold text-[#7B4F35] mb-2 cursor-pointer hover:underline transition-all" style={{ textUnderlineOffset: '3px' }}>
                          {pet.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2">
                        {hasDiscount && (
                          <span className="text-gray-500 line-through text-base">
                            {pet.price.toLocaleString('vi-VN')}₫
                          </span>
                        )}
                        <span className="text-gray-800 font-semibold text-base">
                          {currentPrice.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                    
                    {/* Quantity Controls and Remove */}
                    <div className="flex flex-col items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-0 bg-[#7B4F35] rounded-full overflow-hidden">
                        <button
                          onClick={() => handleUpdateQuantity(pet.petId, -1)}
                          className="px-3 py-2 text-white  hover:cursor-pointer  "
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-8 py-2 text-white font-semibold text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(pet.petId, 1)}
                          className="px-3 py-2 text-white hover:cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(pet.petId)}
                        className="text-[#7B4F35] hover:text-gray-500 transition-colors text-sm font-medium relative group"
                      >
                        <span className="relative">
                          Xóa sản phẩm
                          <span className="absolute left-1/2 bottom-[-7px] w-full h-[1px] bg-[#7B4F35] -translate-x-1/2 group-hover:w-0 transition-all duration-300 ease-in-out"></span>
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-4 border-l border-gray-200 pl-6 flex items-center justify-center">
                    {/* Price and Savings */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800 mb-1">
                        {calculateItemTotal(item).toLocaleString('vi-VN')}₫
                      </div>
                      {hasDiscount && (
                        <div className="text-red-500 font-bold text-sm">
                          TIẾT KIỆM {calculateItemSavings(item).toLocaleString('vi-VN')}₫
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Subtotal Summary */}
            <div className="bg-white px-6 py-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Tạm tính ({items.length} sản phẩm):</span>
                <span className="text-gray-800 font-bold text-xl">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* Customer Information Section */}
            <div className="px-6 py-4">
              <h2 className="font-bold text-xl text-gray-800">THÔNG TIN KHÁCH HÀNG</h2>
            </div>
            <div className="px-6 pb-6 space-y-4">
              {/* Gender */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={customerInfo.gender === 'male'}
                    onChange={(e) => setCustomerInfo({...customerInfo, gender: e.target.value})}
                    className="w-5 h-5 text-[#7B4F35] accent-[#7B4F35]"
                  />
                  <span className="text-lg">Anh</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={customerInfo.gender === 'female'}
                    onChange={(e) => setCustomerInfo({...customerInfo, gender: e.target.value})}
                    className="w-5 h-5 text-[#7B4F35] accent-[#7B4F35]"
                  />
                  <span className="text-lg">Chị</span>
                </label>
              </div>

              {/* Name and Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên"
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B4F35]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B4F35]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B4F35]"
                />
              </div>
            </div>

            {/* Delivery Method Section */}
            <div className="px-6 py-4">
              <h2 className="font-bold text-xl text-gray-800">HÌNH THỨC GIAO HÀNG</h2>
            </div>
            <div className="px-6 pb-6 space-y-4">
              {/* Delivery Type */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="home"
                    checked={customerInfo.deliveryType === 'home'}
                    onChange={(e) => setCustomerInfo({...customerInfo, deliveryType: e.target.value})}
                    className="w-5 h-5 text-[#7B4F35] accent-[#7B4F35]"
                  />
                  <span className="text-lg">Giao hàng tận nơi</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="store"
                    checked={customerInfo.deliveryType === 'store'}
                    onChange={(e) => setCustomerInfo({...customerInfo, deliveryType: e.target.value})}
                    className="w-5 h-5 text-[#7B4F35] accent-[#7B4F35]"
                  />
                  <span className="text-lg">Nhận hàng tại cửa hàng</span>
                </label>
              </div>

              {/* Chọn địa chỉ có sẵn (chỉ hiển thị khi giao hàng tận nơi và có địa chỉ) */}
              {customerInfo.deliveryType === 'home' && userAddresses?.data && userAddresses.data.length > 0 && (
                <div>
                  <label className="block text-gray-700 mb-2">
                    Chọn địa chỉ giao hàng
                    {isDefaultAddressSelected && (
                      <span className="text-green-600 font-semibold"> - Địa chỉ mặc định</span>
                    )}
                  </label>
                  <select
                    value={customerInfo.selectedAddressId}
                    onChange={(e) => {
                      const selectedAddr = userAddresses.data.find(addr => addr.addressId === e.target.value)
                      if (selectedAddr) {
                        const provinceValue = mapProvinceToValue(selectedAddr.province)
                        
                        // Tìm district match (case-insensitive) trong danh sách
                        const availableDistricts = districtsByProvince[provinceValue] || []
                        const matchedDistrict = availableDistricts.find(d => 
                          d.toLowerCase() === (selectedAddr.district || '').toLowerCase()
                        ) || selectedAddr.district || ''
                        
                        setCustomerInfo({
                          ...customerInfo,
                          selectedAddressId: selectedAddr.addressId,
                          province: provinceValue,
                          district: matchedDistrict,
                          address: selectedAddr.street || ''
                        })
                      } else {
                        // Chọn "Nhập địa chỉ mới"
                        setCustomerInfo({
                          ...customerInfo,
                          selectedAddressId: '',
                          province: '',
                          district: '',
                          address: ''
                        })
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B4F35] bg-white"
                  >
                    {userAddresses.data.map((addr) => (
                      <option key={addr.addressId} value={addr.addressId}>
                        {addr.street}, {addr.district}, {addr.province}
                        {addr.isDefault ? ' (Mặc định)' : ''}
                      </option>
                    ))}
                    <option value="">+ Nhập địa chỉ khác</option>
                  </select>
                </div>
              )}

                  {/* Province and District */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Tỉnh thành <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={customerInfo.deliveryType === 'store' ? 'hcm' : customerInfo.province}
                        onChange={(e) => setCustomerInfo({...customerInfo, province: e.target.value, district: '', selectedAddressId: ''})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B4F35] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={customerInfo.deliveryType === 'store' || isAddressFieldsDisabled}
                      >
                        <option value="">Chọn tỉnh thành</option>
                        <option value="hcm">Thành phố Hồ Chí Minh</option>
                        {customerInfo.deliveryType === 'home' && (
                          <>
                            <option value="dongnai">Đồng Nai</option>
                            <option value="khanhhoa">Khánh Hòa</option>
                            <option value="ninhthuan">Ninh Thuận</option>
                            <option value="hanoi">Hà Nội</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Phường xã <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={customerInfo.deliveryType === 'store' ? 'Quận Gò Vấp' : customerInfo.district}
                        onChange={(e) => setCustomerInfo({...customerInfo, district: e.target.value, selectedAddressId: ''})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B4F35] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={customerInfo.deliveryType === 'store' || isAddressFieldsDisabled}
                      >
                        {customerInfo.deliveryType === 'store' ? (
                          <option value="Quận Gò Vấp">Quận Gò Vấp</option>
                        ) : (
                          <>
                            <option value="">Chọn phường / xã</option>
                            {getDistricts().map((district) => (
                              <option key={district} value={district}>{district}</option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Tên đường số nhà <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tên đường / số nhà"
                      value={customerInfo.deliveryType === 'store' ? 'Số 12 Nguyễn Văn Bảo, P. Hạnh Thông' : customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value, selectedAddressId: ''})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B4F35] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={customerInfo.deliveryType === 'store' || isAddressFieldsDisabled}
                    />
                  </div>              {/* Note */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Yêu cầu khác (nếu có)
                </label>
                <input
                  type="text"
                  placeholder="Nhập yêu cầu"
                  value={customerInfo.note}
                  onChange={(e) => setCustomerInfo({...customerInfo, note: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B4F35]"
                />
              </div>

              {/* Save Recipient Checkbox */}
              <div className="flex items-start gap-2 p-4">
                <input
                  type="checkbox"
                  id="saveRecipient"
                  checked={customerInfo.saveRecipient}
                  onChange={(e) => setCustomerInfo({...customerInfo, saveRecipient: e.target.checked})}
                  className="w-5 h-5 mt-0.5 text-[#7B4F35] accent-[#7B4F35] cursor-pointer"
                />
                <label htmlFor="saveRecipient" className="text-gray-700 cursor-pointer">
                  Gọi người khác nhận hàng (Nếu có)
                </label>
              </div>

              {/* Recipient Info (conditional) */}
              {customerInfo.saveRecipient && (
                <div className="p-4 space-y-4 border-2 border-gray-200 rounded-lg">
                  {/* Recipient Gender */}
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="recipientGender"
                        value="male"
                        checked={customerInfo.recipientGender === 'male'}
                        onChange={(e) => setCustomerInfo({...customerInfo, recipientGender: e.target.value})}
                        className="w-5 h-5 text-[#7B4F35] accent-[#7B4F35]"
                      />
                      <span className="text-lg">Anh</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="recipientGender"
                        value="female"
                        checked={customerInfo.recipientGender === 'female'}
                        onChange={(e) => setCustomerInfo({...customerInfo, recipientGender: e.target.value})}
                        className="w-5 h-5 text-[#7B4F35] accent-[#7B4F35]"
                      />
                      <span className="text-lg">Chị</span>
                    </label>
                  </div>

                  {/* Recipient Name and Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Họ và tên người nhận <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập họ và tên"
                        value={customerInfo.recipientName}
                        onChange={(e) => setCustomerInfo({...customerInfo, recipientName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B4F35]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        value={customerInfo.recipientPhone}
                        onChange={(e) => setCustomerInfo({...customerInfo, recipientPhone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B4F35]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="px-6 py-4">
              <h2 className="font-bold text-xl text-gray-800">Hình thức thanh toán</h2>
            </div>
            <div className="px-6 pb-6 space-y-4">
              {/* Cash Payment */}
              <label className="flex items-start gap-3 cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-[#7B4F35] transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={customerInfo.paymentMethod === 'cash'}
                  onChange={(e) => setCustomerInfo({...customerInfo, paymentMethod: e.target.value})}
                  className="w-5 h-5 mt-0.5 text-[#7B4F35] accent-[#7B4F35] cursor-pointer"
                />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-800">Thanh toán tiền mặt khi nhận hàng</span>
                </div>
              </label>

              {/* Bank Transfer */}
              <label className="flex items-start gap-3 cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-[#7B4F35] transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={customerInfo.paymentMethod === 'bank'}
                  onChange={(e) => setCustomerInfo({...customerInfo, paymentMethod: e.target.value})}
                  className="w-5 h-5 mt-0.5 text-[#7B4F35] accent-[#7B4F35] cursor-pointer"
                />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-800">Chuyển khoản ngân hàng</span>
                </div>
              </label>
            </div>

            {/* Cart Totals Section */}
            <div className="px-6 py-4">
              <h2 className="font-bold text-xl text-gray-800">CHI TIẾT THANH TOÁN</h2>
            </div>
            <div className="px-6 pb-6">
              {/* Tiền hàng */}
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700">Tiền hàng:</span>
                <span className="text-gray-800 font-semibold">{subtotal.toLocaleString('vi-VN')} đ</span>
              </div>

              {/* Phí vận chuyển */}
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700">Phí vận chuyển:</span>
                <span className="text-gray-800 font-semibold">{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} đ`}</span>
              </div>

              {/* Khuyến mãi (Promotions - Khách hàng tự chọn) */}
              <div className="py-3 border-b border-gray-300">
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => setShowPromotions(!showPromotions)}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#7B4F35] transition-colors"
                  >
                    <span className="font-semibold">🎁 Chọn khuyến mãi</span>
                    {showPromotions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {promotionDiscount > 0 && (
                    <span className="text-green-600 font-semibold">
                      -{promotionDiscount.toLocaleString('vi-VN')} đ
                    </span>
                  )}
                </div>

                {/* Danh sách khuyến mãi (Chỉ chọn 1) */}
                {showPromotions && (
                  <div className="mb-4 max-h-64 overflow-y-auto space-y-2">
                    {promotionsData?.content && promotionsData.content.length > 0 ? (
                      promotionsData.content
                        .filter((promo) => {
                          const now = new Date()
                          const startDate = new Date(promo.startDate)
                          const endDate = new Date(promo.endDate)
                          return now >= startDate && now <= endDate
                        })
                        .map((promo) => {
                          const now = new Date()
                          const startDate = new Date(promo.startDate)
                          const endDate = new Date(promo.endDate)
                          const isValid = now >= startDate && now <= endDate
                          const canApply = isValid && (!promo.minOrderAmount || subtotal >= promo.minOrderAmount)
                          const isSelected = selectedPromotion === promo.code
                        
                        return (
                          <div
                            key={promo.promotionId}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              canApply 
                                ? isSelected
                                  ? 'border-green-500 bg-green-100'
                                  : 'border-green-300 bg-green-50 hover:border-green-500'
                                : 'border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed'
                            }`}
                            onClick={() => canApply && handleSelectPromotion(promo.code)}
                          >
                            <div className="flex items-start gap-3">
                              {/* Radio button */}
                              <input
                                type="radio"
                                checked={isSelected}
                                disabled={!canApply}
                                onChange={() => {}}
                                className="w-5 h-5 mt-1 text-green-600 accent-green-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-[#7B4F35]">{promo.code}</span>
                                  {canApply ? (
                                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">Có thể áp dụng</span>
                                  ) : (
                                    <span className="text-xs bg-gray-400 text-white px-2 py-0.5 rounded">Chưa đủ điều kiện</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 mb-1">{promo.description}</p>
                                <div className="text-xs text-gray-600 space-y-0.5">
                                  <p>
                                    <span className="font-semibold">Giảm:</span> {
                                      promo.discountValue <= 100 && promo.promotionType === 'DISCOUNT'
                                        ? `${promo.discountValue}%`
                                        : `${promo.discountValue.toLocaleString('vi-VN')}đ`
                                    }
                                  </p>
                                  {promo.minOrderAmount && (
                                    <p>
                                      <span className="font-semibold">Đơn tối thiểu:</span> {promo.minOrderAmount.toLocaleString('vi-VN')}đ
                                    </p>
                                  )}
                                  <p>
                                    <span className="font-semibold">HSD:</span> {new Date(promo.endDate).toLocaleDateString('vi-VN')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">Không có khuyến mãi nào</p>
                    )}
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                      ℹ️ Chỉ được chọn 1 khuyến mãi
                    </div>
                  </div>
                )}

                {/* Hiển thị khuyến mãi đã chọn */}
                {selectedPromotion && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-green-800">Đã chọn:</span>
                        <span className="text-sm font-bold text-[#7B4F35]">{selectedPromotion}</span>
                      </div>
                      <button
                        onClick={() => setSelectedPromotion(null)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Bỏ chọn
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mã giảm giá Voucher (User tự nhập) */}
              <div className="py-3 border-b border-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-semibold">🎟️ Mã giảm giá (Voucher):</span>
                  <span className="text-red-600 font-semibold">-{voucherDiscount.toLocaleString('vi-VN')} đ</span>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Nhập mã voucher"
                    value={voucherCode}
                    onChange={(e) => {
                      setVoucherCode(e.target.value.toUpperCase())
                      setVoucherError('')
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isApplyingVoucher && !appliedVoucher) {
                        handleApplyVoucher()
                      }
                    }}
                    disabled={isApplyingVoucher || !!appliedVoucher}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B4F35] disabled:bg-gray-100 disabled:cursor-not-allowed uppercase"
                  />
                  <button
                    onClick={handleApplyVoucher}
                    disabled={isApplyingVoucher || !!appliedVoucher}
                    className="bg-[#FF6B6B] text-white px-6 py-2 rounded font-semibold hover:bg-[#FF5555] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[100px]"
                  >
                    {isApplyingVoucher ? 'Đang xử lý...' : 'Áp dụng'}
                  </button>
                </div>

                {/* Voucher đã áp dụng */}
                {appliedVoucher && (
                  <div className="mb-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-green-800 font-bold text-sm">{appliedVoucher.code}</p>
                            <button
                              onClick={handleRemoveVoucher}
                              className="text-red-600 hover:text-red-800 text-xs font-medium"
                            >
                              Xóa
                            </button>
                          </div>
                          <p className="text-green-700 text-xs mt-1">{appliedVoucher.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error message */}
                {voucherError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-red-800 text-sm">{voucherError}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tổng cộng */}
              <div className="flex justify-between items-center py-4">
                <span className="text-gray-800 font-bold text-lg">Tổng cộng:</span>
                <span className="text-red-600 font-bold text-2xl">{finalTotal.toLocaleString('vi-VN')} đ</span>
              </div>

              {/* Terms Notice */}
              <div className="py-4 border-t border-gray-200">
                <div className="text-gray-700 text-sm">
                  <span className="inline-flex items-start gap-1">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>
                      Bằng việc tiến hành đặt mua hàng, bạn đồng ý với{' '}
                      <a href="#" className="text-blue-600 underline hover:text-blue-800">Điều khoản sử dụng</a>
                      {' '}và{' '}
                      <a href="#" className="text-blue-600 underline hover:text-blue-800">Chính sách xử lý dữ liệu</a>
                      {' '}của Petopia.
                    </span>
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-4">
                <button 
                  onClick={handleCheckout}
                  className="w-full px-12 py-4 rounded-full font-bold text-lg uppercase tracking-wide transition-colors bg-[#7B4F35] text-white hover:bg-[#C46C2B] cursor-pointer shadow-lg"
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default CartPage
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { useCart } from '@/store/useCartStore'
import Link from 'next/link'

const CartPage = () => {
  const { 
    items, 
    subtotal, 
    updateQuantity, 
    removeItem,
    calculateItemTotal,
    calculateItemSavings 
  } = useCart()

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
    paymentMethod: 'cash' // cash or bank
  })

  // Promotion code state
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleApplyPromo = () => {
    // Logic áp dụng mã khuyến mãi
    if (promoCode.trim()) {
      // Ví dụ: giảm 10%
      // setDiscount(subtotal * 0.1)
      alert('Áp dụng mã khuyến mãi: ' + promoCode)
    }
  }

  const shippingFee = 0 // Miễn phí
  const finalTotal = subtotal - discount + shippingFee

  // Districts by province
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

  const getDistricts = () => {
    if (customerInfo.deliveryType === 'store') {
      return ['P. Hạnh Thông']
    }
    return districtsByProvince[customerInfo.province] || []
  }

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

                  {/* Province and District */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Tỉnh thành <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={customerInfo.deliveryType === 'store' ? 'hcm' : customerInfo.province}
                        onChange={(e) => setCustomerInfo({...customerInfo, province: e.target.value, district: ''})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B4F35] bg-white"
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
                        value={customerInfo.deliveryType === 'store' ? 'P. Hạnh Thông' : customerInfo.district}
                        onChange={(e) => setCustomerInfo({...customerInfo, district: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B4F35] bg-white"
                        disabled={!customerInfo.province && customerInfo.deliveryType === 'home'}
                      >
                        {customerInfo.deliveryType === 'store' ? (
                          <option value="P. Hạnh Thông">P. Hạnh Thông</option>
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
                      value={customerInfo.deliveryType === 'store' ? 'Số 12 Nguyễn Văn Bảo' : customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B4F35]"
                      disabled={customerInfo.deliveryType === 'store'}
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

              {/* Khuyến mãi */}
              <div className="py-3 border-b border-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Khuyến mãi:</span>
                  <span className="text-gray-800 font-semibold">{discount.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã khuyến mãi"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7B4F35]"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
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
  )
}

export default CartPage
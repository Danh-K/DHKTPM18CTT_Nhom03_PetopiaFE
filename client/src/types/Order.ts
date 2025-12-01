export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum OrderPaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  COD = 'COD',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export interface OrderItem {
  petId: string;
  petName: string;
  petImage?: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  orderId: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress?: string | null;
  totalAmount: number;
  shippingFee?: number | null;
  discountAmount?: number | null;
  voucherDiscountAmount?: number | null;
  promotionDiscountAmount?: number | null;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  paymentMethod?: PaymentMethod | null;
  // Thông tin ngân hàng hiển thị ở màn hình thanh toán QR
  bankName?: string | null;
  accountName?: string | null;
  accountNo?: string | null;
  note?: string | null;
  createdAt: string;
  
  // Payment Info (Nếu chọn Chuyển khoản)
  paymentUrl?: string;      // Link ảnh QR Code SePay
  transactionId?: string;   // Nội dung chuyển khoản (VD: "THANHTOAN ORxxx")
  
  // Order Items
  orderItems?: OrderItem[];
}


export interface DeliveryHistory {
  status: string;
  description: string;
  location: string | null;
  updatedAt: string;
}

export interface Delivery {
  deliveryId: string;
  trackingNumber: string | null;
  orderId: string;
  shippingMethod: string;
  shippingFee: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  totalAmount: number;
  itemCount: number;
  currentStatus: string;
  estimatedDeliveryDate: string | null;
  createdAt: string;
  timeline: DeliveryHistory[];
}



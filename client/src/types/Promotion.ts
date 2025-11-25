export interface Promotion {
  promotionId: string
  code: string
  description: string
  promotionType: 'FREESHIP' | 'DISCOUNT' | 'CASHBACK' | 'BUNDLE'
  discountValue: number
  minOrderAmount?: number
  startDate: string
  endDate: string
  maxUsage?: number
  usedCount?: number
  categoryId?: string
  imageUrl?: string
}

export interface PromotionResponse {
  content: Promotion[]
  totalElements: number
  page: number
  size: number
}

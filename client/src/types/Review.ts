export type Review = {
  reviewId: string;
  userId?: string | null;
  userFullName?: string | null;
  userAvatar?: string | null;
  petId?: string | null;
  petName?: string | null;
  petImage?: string | null;
  rating: number;
  comment: string;
  reviewImageUrl?: string | null;
  createdAt: string;
  reply?: string | null;
  replyDate?: string | null;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
};

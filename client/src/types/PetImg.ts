export interface PetImg {
  imageId: number;
  petId: number;
  imageUrl: string;
  isThumbnail: boolean;
  createdAt: string; // ISO Date string
}

export interface PetImgRequest {
  imageUrl: string;
  isThumbnail?: boolean;
}
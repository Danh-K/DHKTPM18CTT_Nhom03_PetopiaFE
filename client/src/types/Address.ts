export interface Address {
  addressId: string;
  street: string;
  ward: string | null;
  district: string | null;
  province: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}


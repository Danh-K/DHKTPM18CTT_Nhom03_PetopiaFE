import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService, UserUpdateDTO, Address } from "@/service/user.service";
import { useAuthStore } from "@/store/useAuthStore";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: UserService.getProfile,
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { setUser, user } = useAuthStore();

  return useMutation({
    mutationFn: (data: UserUpdateDTO) => UserService.updateProfile(data),
    
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      if (updatedUser) {
          setUser(updatedUser); 
      }
    },
    
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Lỗi cập nhật hồ sơ";
      console.error("Update profile error:", error);
    },
  });
};


export const useMyAddresses = () => {
  return useQuery({
    queryKey: ["user-addresses"],
    queryFn: UserService.getMyAddresses,
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Address) => UserService.addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },
    onError: (error: any) => console.log(error),
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Address) => UserService.updateAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },
    onError: (error: any) => console.log(error),
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId: string) => UserService.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },
  });
};

export const useSetDefaultAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (addressId: string) => UserService.setDefaultAddress(addressId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      },
    });
  };
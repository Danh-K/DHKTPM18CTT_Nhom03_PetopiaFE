import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WishlistService } from "@/service/wishlist.service";

export const useMyWishlist = () => {
  return useQuery({
    queryKey: ["my-wishlist"],
    queryFn: () => WishlistService.getMyWishlist(),
    retry: false,
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (petId: string) => WishlistService.toggleWishlist(petId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-wishlist"] });
    },
    onError: () => {
        queryClient.invalidateQueries({ queryKey: ["my-wishlist"] });
    }
  });
};
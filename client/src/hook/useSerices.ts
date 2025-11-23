import { ShopServiceAPI } from "@/service/service.service";
import { useQuery } from "@tanstack/react-query";

export const useShopServices = () => {
  return useQuery({
    queryKey: ["shop-services"],
    queryFn: ShopServiceAPI.getAll,
  });
};
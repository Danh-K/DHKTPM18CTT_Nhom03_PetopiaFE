import { PetService } from "@/service/pet.service";
import { useQuery } from "@tanstack/react-query";

export const usePets = () => {
  return useQuery({
    queryKey: ["pets"],
    queryFn: PetService.getAll,
    staleTime: 5 * 60 * 1000,
  });
};
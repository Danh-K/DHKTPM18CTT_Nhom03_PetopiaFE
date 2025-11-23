import { CategoryService } from "@/service/category.service";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getAll,
    staleTime: 1000 * 60 * 30,
  });
};


export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => CategoryService.getById(id),
    enabled: !!id, 
  });
};
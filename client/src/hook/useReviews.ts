import { ReviewService } from "@/service/review.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export const useReviews = (petId: number) => {
  return useQuery({
    queryKey: ["reviews", petId],
    queryFn: () => ReviewService.getByPetId(petId),
    enabled: !!petId,
  });
};


export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ReviewService.create,
    onSuccess: (_, variables) => {
      
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.petId] });
    },
  });
};
import { PetImgService } from "@/service/pet-img.service";
import { PetImgRequest } from "@/types/PetImg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const PET_IMAGES_KEY = "pet-images";


export const usePetImages = (petId: number) => {
  return useQuery({
    queryKey: [PET_IMAGES_KEY, petId],
    queryFn: () => PetImgService.getByPetId(petId),
    enabled: !!petId, 
  });
};
export const useAllPetImages = () => {
  return useQuery({
    queryKey: ["all-pet-images"],
    queryFn: PetImgService.getAll,
  });
};
export const useAddPetImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, data }: { petId: number; data: PetImgRequest }) =>
      PetImgService.add(petId, data),
    onSuccess: (_, variables) => {
      
      queryClient.invalidateQueries({ queryKey: [PET_IMAGES_KEY, variables.petId] });
    },
  });
};


export const useDeletePetImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PetImgService.delete,
    onSuccess: (_, imageId) => {
      
      
      
      queryClient.invalidateQueries({ queryKey: [PET_IMAGES_KEY] });
    },
  });
};


export const useSetThumbnail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, imageId }: { petId: number; imageId: number }) =>
      PetImgService.setThumbnail(petId, imageId),
    onSuccess: (_, variables) => {
      
      queryClient.invalidateQueries({ queryKey: [PET_IMAGES_KEY, variables.petId] });
      
      
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });
};
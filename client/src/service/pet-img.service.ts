import { PetImg } from "@/server/routers/petImg";
import { PetImgRequest } from "@/types/PetImg";
import axios from "axios";

export const PetImgService = {
  getByPetId: async (petId: number): Promise<PetImg[]> => {
    
    const response = await axios.get(`/pets/${petId}/images`);
    return response.data;
  },
  getAll: async (): Promise<PetImg[]> => {
    const response = await axios.get(`/pet-images`);
    return response.data;
  }
  ,

  
  add: async (petId: number, data: PetImgRequest): Promise<PetImg> => {
    
    const response = await axios.post(`/pets/${petId}/images`, data);
    return response.data;
  },

  
  delete: async (imageId: number): Promise<void> => {
    
    await axios.delete(`/pet-images/${imageId}`);
  },

  
  setThumbnail: async (petId: number, imageId: number): Promise<void> => {
    
    await axios.put(`/pets/${petId}/images/${imageId}/thumbnail`);
  },
};
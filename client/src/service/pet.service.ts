import axios from "@/lib/utils/axios"; 
import { Pet } from "@/types/Pet";

export const PetService = {
  getAll: async (): Promise<Pet[]> => {
    const response = await axios.get("/pets"); 
    return response.data.content;
  },

  getPetById: async (id: number): Promise<Pet> => {
    const response = await axios.get(`/pets/${id}`);
    return response.data.content;
  },
};
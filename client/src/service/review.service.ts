import { Review } from "@/types/Review";
import axios from "axios";

export const ReviewService = {
  getByPetId: async (petId: number): Promise<Review[]> => {
    const response = await axios.get(`/reviews/pet/${petId}`);
    return response.data;
  },

  create: async (data: { petId: number; rating: number; comment: string }) => {
    const response = await axios.post("/reviews", data);
    return response.data;
  },
};
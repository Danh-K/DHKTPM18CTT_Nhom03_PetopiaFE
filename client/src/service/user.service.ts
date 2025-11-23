import { User } from "@/server/routers/user";
import axios from "axios";

export const UserService = {
  getProfile: async (): Promise<User> => {
    const response = await axios.get("/users/profile");
    return response.data;
  },

};
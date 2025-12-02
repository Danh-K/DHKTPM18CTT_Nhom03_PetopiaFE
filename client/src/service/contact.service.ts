import axiosInstance from "@/lib/utils/axios";
import { Contact } from "@/types/Contact";

export const ContactService = {
  send: async (data: Contact) => {
    const response = await axiosInstance.post("/contact/send", data);
    return response.data;
  },
};
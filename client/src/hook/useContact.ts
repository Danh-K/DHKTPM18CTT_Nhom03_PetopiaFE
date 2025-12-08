import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hook/useToast"; 
import { Contact } from "@/types/Contact";
import { ContactService } from "@/service/contact.service";

export const useSendContact = () => {
  const { success: showSuccess, error: showError } = useToast();

  return useMutation({
    mutationFn: (data: Contact) => ContactService.send(data),
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Gửi liên hệ thất bại. Vui lòng thử lại.";
      showError("Lỗi", msg);
    },
  });
};
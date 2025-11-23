import { UserService } from "@/service/user.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: UserService.getProfile,
    retry: false, 
  });
};


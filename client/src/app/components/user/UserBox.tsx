"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Package, 
  LogOut, 
  User as UserIcon,
  Sparkles,
  PawPrint
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserBox({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    onClose?.();
    router.push("/"); 
  };

 
  const getAvatar = (url?: string | null) => {
     return url? url :  "/assets/imgs/imgPet/cat-6593947_1280.jpg";
  };

 
  if (!user) {
    return (
      <Card className="shadow-xl border-none rounded-2xl overflow-hidden w-[280px]">
        <CardContent className="p-0">
          
         
          <div className="bg-[#FDF5F0] p-5 flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-[-10px] right-[-10px] text-[#FF6B6B] opacity-10 rotate-12">
                <PawPrint size={60} />
             </div>
             
             <div className="relative z-10">
              <p className="font-bold text-[#5A3E2B] text-lg flex items-center gap-2">
                 Chào Sen! <Sparkles size={16} className="text-yellow-400 fill-yellow-400" />
              </p>
              <p className="text-sm text-[#8B6E5B] mt-1">Đăng nhập để tích điểm nha.</p>
            </div>
          </div>

         
          <div className="flex gap-3 p-4 bg-white">
            <Link
              href="/register"
              className="flex-1 border border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FFF0F5] text-center py-2.5 rounded-xl transition-colors font-bold text-sm flex items-center justify-center"
              onClick={onClose}
            >
              Đăng ký
            </Link>
            <Link
              href="/login"
              className="flex-1 bg-[#FF6B6B] hover:bg-[#ff5252] text-white text-center py-2.5 rounded-xl transition-colors font-bold text-sm shadow-md shadow-red-100 flex items-center justify-center"
              onClick={onClose}
            >
              Đăng nhập
            </Link>
          </div>

          <div className="border-t border-gray-100 p-2 bg-gray-50/50">
             <p className="text-xs text-center text-gray-400">Mua thì hời, bán thì lời 🐝</p>
          </div>
        </CardContent>
      </Card>
    );
  }

 
  return (
    <Card className="shadow-xl border-none rounded-2xl overflow-hidden w-[280px]">
      <CardContent className="p-0">
        
       
        <div className="bg-[#FDF5F0] p-5 flex items-center gap-3 relative border-b border-[#FFE4E1]">
          <div className="h-12 w-12 rounded-full bg-white border-2 border-[#FF6B6B] overflow-hidden flex-shrink-0 p-0.5">
             <Image 
               src={getAvatar(user.avatar)} 
               alt="Avatar" 
               width={48} height={48}
               className="object-cover w-full h-full rounded-full" 
             />
          </div>
          <div className="overflow-hidden relative z-10">
            <p className="font-bold text-[#5A3E2B] text-base truncate">{user.fullName || user.username}</p>
            <p className="text-xs text-[#8B6E5B] truncate bg-white/50 px-2 py-0.5 rounded-full inline-block mt-1">
                @{user.username}
            </p>
          </div>
        </div>

       
        <div className="bg-white py-2">
          <ul className="flex flex-col">
            
           
            <li>
              <Link 
                href="/profile" 
                className="flex items-center gap-3 px-5 py-3 hover:bg-[#FFF0F5] text-gray-600 hover:text-[#FF6B6B] transition-colors font-medium group" 
                onClick={onClose}
              >
                <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center transition-colors">
                    <UserIcon size={18} />
                </div>
                Quản lý tài khoản
              </Link>
            </li>

           
            <li>
              <Link 
                href="/wishlist" 
                className="flex items-center gap-3 px-5 py-3 hover:bg-[#FFF0F5] text-gray-600 hover:text-[#FF6B6B] transition-colors font-medium group" 
                onClick={onClose}
              >
                <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center transition-colors">
                    <Heart size={18} />
                </div>
                Thú cưng yêu thích
              </Link>
            </li>

           
            <li>
              <Link 
                href="/orders" 
                className="flex items-center gap-3 px-5 py-3 hover:bg-[#FFF0F5] text-gray-600 hover:text-[#FF6B6B] transition-colors font-medium group" 
                onClick={onClose}
              >
                <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center transition-colors">
                    <Package size={18} />
                </div>
                Đơn hàng của tôi
              </Link>
            </li>
            
            <div className="my-1 border-t border-gray-100 mx-5"></div>

           
            <li 
              className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 cursor-pointer text-gray-500 hover:text-red-500 transition-colors font-medium group"
              onClick={handleLogout}
            >
              <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center transition-colors">
                 <LogOut size={18} />
              </div>
              Đăng xuất
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
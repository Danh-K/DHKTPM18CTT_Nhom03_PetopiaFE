"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Bookmark, 
  Clock, 
  Star, 
  Package, 
  LogOut, 
  Settings, 
  User as UserIcon 
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

  
  if (!user) {
    return (
      <Card className="shadow-xl border rounded-xl overflow-hidden">
        <CardContent className="p-0">
          
          <div className="bg-[#FDF5F0] p-4 flex justify-between items-center">
            <div>
              <p className="font-bold text-[#7B4F35] text-lg">Mua thì hời, bán thì lời.</p>
              <p className="text-sm text-gray-600">Đăng nhập ngay để khám phá!</p>
            </div>
            <div className="text-4xl">🐝</div>
          </div>

          
          <div className="flex gap-3 p-4">
            <Link
              href="/register"
              className="flex-1 border border-[#7B4F35] text-[#7B4F35] hover:bg-[#7B4F35]/10 text-center py-2 rounded transition-colors font-medium"
              onClick={onClose}
            >
              Tạo tài khoản
            </Link>
            <Link
              href="/login"
              className="flex-1 bg-[#7B4F35] hover:bg-[#6B3F25] text-white text-center py-2 rounded transition-colors font-medium"
              onClick={onClose}
            >
              Đăng nhập
            </Link>
          </div>

          
          <div className="border-t">
            <ul className="divide-y">
              <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700 transition-colors" onClick={onClose}>
                <Heart className="w-5 h-5 text-[#7B4F35]" />
                Tin đăng đã lưu
              </li>
              <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700 transition-colors" onClick={onClose}>
                <Bookmark className="w-5 h-5 text-[#7B4F35]" />
                Tìm kiếm đã lưu
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  
  return (
    <Card className="shadow-xl border rounded-xl overflow-hidden">
      <CardContent className="p-0">
        
        <div className="bg-[#FDF5F0] p-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-white border-2 border-[#7B4F35] overflow-hidden flex-shrink-0">
             <Image 
               src={user.avatar || "https://drive.google.com/uc?id=117JvrU7k1kskdkc-NMydONhI_flRtie7"} 
               alt="Avatar" 
               width={48}
               height={48}
               className="object-cover" 
             />
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-[#7B4F35] text-lg truncate">{user.fullName || user.username}</p>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
          </div>
        </div>

        
        <div className="border-t">
          <ul className="divide-y">
            <li>
              <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors" onClick={onClose}>
                <Settings className="w-5 h-5 text-[#7B4F35]" />
                Quản lý tài khoản
              </Link>
            </li>
            <li>
              <Link href="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors" onClick={onClose}>
                <Package className="w-5 h-5 text-[#7B4F35]" />
                Đơn hàng của tôi
              </Link>
            </li>
            <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700 transition-colors" onClick={onClose}>
              <Clock className="w-5 h-5 text-[#7B4F35]" />
              Lịch sử hoạt động
            </li>
            
            
            <li 
              className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 cursor-pointer text-red-600 transition-colors font-medium"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import { ChevronDown, Search, ShoppingCart, Menu, Heart } from "lucide-react";
import UserBox from "@/app/components/user/UserBox"; 
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/useCartStore";
import { useFavorite } from "@/store/useFavoriteStore";
import { useAuthStore } from "@/store/useAuthStore"; 

const leftLinks = [
  { label: "TRANG CHỦ", href: "/" },
  { label: "GIỚI THIỆU", href: "/abouts" },
  { label: "TIN TỨC", href: "/news" },
];

const rightLinks = [
  { label: "THÚ CƯNG", href: "/pets" },
  { label: "DỊCH VỤ", href: "/services" },
  { label: "LIÊN HỆ", href: "/contacts" },
];

export default function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { totalItems: totalFavorites } = useFavorite();
  
  const { user } = useAuthStore();
  
  const [openUserBox, setOpenUserBox] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenUserBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-[#7B4F35] flex items-center justify-between px-4 lg:px-8 py-4 backdrop-blur-sm transition-all duration-300 sticky top-0 z-50 shadow-md">
      {/* Left: Logo + Links */}
      <div className="flex items-center gap-4 lg:gap-8">
        <Link href="/" className="flex items-center group cursor-pointer">
          <Image
            src="/assets/imgs/logo.png"
            alt="Petopia Logo"
            width={40}
            height={40}
            className="w-8 h-8 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-110"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-6 lg:gap-8">
          {leftLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-2 text-white hover:text-[#F5D7B7] transition-colors font-medium ${
                pathname === link.href ? "text-[#F5D7B7] font-bold" : ""
              }`}
            >
              <Image
                src="/assets/svg/chanmeo.svg"
                alt="Paw icon"
                width={20}
                height={20}
                className="w-5 h-5 filter brightness-0 invert transition-all duration-300 group-hover:brightness-0 group-hover:sepia-100 group-hover:saturate-[4000%] group-hover:hue-rotate-[340deg]"
              />
              {link.label}
            </Link>
          ))}
          
          {rightLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-2 text-white hover:text-[#F5D7B7] transition-colors font-medium ${
                pathname === link.href ? "text-[#F5D7B7] font-bold" : ""
              }`}
            >
              <Image
                src="/assets/svg/chanmeo.svg"
                alt="Paw icon"
                width={20}
                height={20}
                className="w-5 h-5 filter brightness-0 invert transition-all duration-300 group-hover:brightness-0 group-hover:sepia-100 group-hover:saturate-[4000%] group-hover:hue-rotate-[340deg]"
              />
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-3">
        

        {/* Wishlist Button */}
        <Link href="/favorites" className="relative">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-[#F5D7B7] transition-all duration-300 hover:scale-110 shadow-md group"
          >
            <Heart size={20} className="text-[#7B4F35] group-hover:text-[#6B3F25]" />
            {totalFavorites > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce border-2 border-[#7B4F35]">
                {totalFavorites}
              </span>
            )}
          </button>
        </Link>

        {/* Cart Button */}
        <Link href="/carts" className="relative">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-[#F5D7B7] transition-all duration-300 hover:scale-110 shadow-md group"
          >
            <ShoppingCart size={20} className="text-[#7B4F35] group-hover:text-[#6B3F25]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce border-2 border-[#7B4F35]">
                {totalItems}
              </span>
            )}
          </button>
        </Link>

        {/* User Avatar Dropdown */}
        <div ref={dropdownRef} className="relative flex items-center">
          <button
            className="flex items-center gap-2 focus:outline-none cursor-pointer group"
            onClick={() => setOpenUserBox((v) => !v)}
            type="button"
          >
            {/* Custom Avatar Replacement */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 group-hover:border-white/50 transition-transform duration-300 group-hover:scale-110 shadow-sm">
                {user?.avatar ? (
                    <img 
                        src={user.avatar} 
                        alt="User Avatar" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-[#F5D7B7] flex items-center justify-center text-[#7B4F35] font-bold">
                        {user?.username ? user.username.charAt(0).toUpperCase() : "G"}
                    </div>
                )}
            </div>
            
            {/* Hiển thị tên User (chỉ trên màn hình lớn) */}
            {user && (
                <div className="hidden md:flex flex-col items-start">
                    <span className="text-white text-sm font-bold max-w-[100px] truncate">
                        {user.fullName || user.username}
                    </span>
                </div>
            )}
            
            <ChevronDown 
              size={20} 
              className={`text-white ml-1 transition-transform duration-200 ${openUserBox ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown Content */}
          {openUserBox && (
            <div className="absolute top-full right-0 mt-4 w-80 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              {/* Lưu ý: Nếu UserBox bên trong cũng dùng shadcn card thì bạn có thể cần sửa nốt file đó, hoặc để nguyên nếu chỉ cần sửa Header */}
              <UserBox onClose={() => setOpenUserBox(false)} />
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 text-white hover:bg-white/20 transition-all duration-300 rounded-xl"
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
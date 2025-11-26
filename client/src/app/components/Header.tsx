"use client";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import UserBox from "@/app/components/user/UserBox";

import { 
  Search, 
  ShoppingCart, 
  Menu,
  Heart
} from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/useCartStore";
import { useFavorite } from "@/store/useFavoriteStore";


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

  // Giả lập trạng thái đăng nhập
  const [user] = React.useState<null | { name: string; avatar?: string }>(null);
  const [openUserBox, setOpenUserBox] = React.useState(false);

  // Đóng dropdown khi click ngoài
  React.useEffect(() => {
    if (!openUserBox) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) return;
      if (!e.target.closest("#user-avatar-dropdown")) setOpenUserBox(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openUserBox]);

  return (
    <header className="w-full bg-[#7B4F35] flex items-center justify-between px-4 lg:px-8 py-4 backdrop-blur-sm transition-all duration-300">
      {/* Left: Logo + All Navigation */}
      <div className="flex items-center gap-4 lg:gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center group cursor-pointer">
          <Image
            src="/assets/imgs/logo.png"
            alt="Petopia Logo"
            width={40}
            height={40}
            className="w-8 h-8 lg:w-10 lg:h-10 transition-transform duration-300 group-hover:scale-110"
          />
        </Link>

        {/* All Navigation Items */}
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
                className="w-5 h-5 filter brightness-0 invert transition-all duration-300 group-hover:brightness-0 group-hover:saturate-100 group-hover:invert-[53%] group-hover:sepia-100 group-hover:saturate-[4000%] group-hover:hue-rotate-[340deg] group-hover:brightness-105 group-hover:contrast-105"
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
                className="w-5 h-5 filter brightness-0 invert transition-all duration-300 group-hover:brightness-0 group-hover:saturate-100 group-hover:invert-[53%] group-hover:sepia-100 group-hover:saturate-[4000%] group-hover:hue-rotate-[340deg] group-hover:brightness-105 group-hover:contrast-105"
              />
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <Link href="/pets">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white hover:bg-[#F5D7B7] transition-all duration-300 hover:scale-110 shadow-md group cursor-pointer"
          >
            <Search size={20} className="text-[#7B4F35] group-hover:text-[#6B3F25]" />
          </Button>
        </Link>

        {/* Heart/Wishlist */}
        <Link href="/favorites" className="relative cursor-pointer">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white hover:bg-[#F5D7B7] transition-all duration-300 hover:scale-110 shadow-md group cursor-pointer"
          >
            <Heart size={20} className="text-[#7B4F35] group-hover:text-[#6B3F25]" />
            {totalFavorites > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalFavorites}
              </span>
            )}
          </Button>
        </Link>

        {/* Cart */}
        <Link href="/carts" className="relative cursor-pointer">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white hover:bg-[#F5D7B7] transition-all duration-300 hover:scale-110 shadow-md group cursor-pointer"
          >
            <ShoppingCart size={20} className="text-[#7B4F35] group-hover:text-[#6B3F25]" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Button>
        </Link>

        {/* User dropdown */}
        <div id="user-avatar-dropdown" className="relative flex items-center">
          <button
            className="flex items-center gap-1 focus:outline-none cursor-pointer"
            onClick={() => setOpenUserBox((v) => !v)}
            aria-label="Tài khoản"
            type="button"
          >
            <Avatar className="transition-transform duration-300 hover:scale-110 ring-2 ring-white/30 hover:ring-white/50">
              {user && user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarImage src="/avatar.jpg" alt="Avatar" />
              )}
              <AvatarFallback className="bg-[#F5D7B7] text-[#7B4F35] font-bold">
                {user ? user.name.charAt(0).toUpperCase() : <span className="text-xl">👤</span>}
              </AvatarFallback>
            </Avatar>
            <ChevronDown size={20} className="text-[#fff] ml-1" />
          </button>
          {openUserBox && (
            <div className="absolute right-0 w-80 max-w-xs"
            style={{ marginTop: '400px' }}>
              <UserBox />
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:bg-white/20 transition-all duration-300 rounded-xl cursor-pointer"
        >
          <Menu size={24} />
        </Button>
      </div>
    </header>
  );
}

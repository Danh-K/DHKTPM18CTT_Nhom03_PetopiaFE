"use client";

import { HiBell, HiSearch, HiMoon, HiSun, HiLogout, HiCog } from "react-icons/hi";
import { useState } from "react";
import logo from "../assets/image.png";
import { FaCat, FaDog } from "react-icons/fa";

const notifications = [
  {
    id: 1,
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Lana Byrd",
    message:
      'New message from Lana Byrd: "Hey, what\'s up? All set for the presentation?"',
    time: "a few moments ago",
  },
  {
    id: 2,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Jese Leos",
    message: "started following you.",
    time: "10 minutes ago",
  },
  {
    id: 3,
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    name: "Bonnie Green",
    message: "is requesting to upgrade the Flowbite Plan.",
    time: "32 minutes ago",
    action: true,
  },
  {
    id: 4,
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    name: "Joseph Mcfall",
    message: "and 141 others love your story. See it and view more stories.",
    time: "44 minutes ago",
  },
];

function Header({ darkMode, setDarkMode, user, logout }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const unreadCount = notifications.length;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#7b4f35] shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Petopia"
            className="h-14 w-14 rounded-full object-cover ring-4 ring-amber-300/50 shadow-2xl
                      animate-[float_6s_ease-in-out_infinite] 
                      hover:animate-none hover:scale-125 hover:ring-amber-200 hover:ring-8
                      transition-all duration-700"
          />
          <span className="flex items-center gap-1">
            <span className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl animate-[bounce_3s_infinite]">P</span>
            
            {/* Chữ "e" → thay bằng mèo quay đầu về phải */}
            <div className="animate-[bounce_3s_infinite] [animation-delay:0.1s]">
              <FaCat className="h-11 w-11 text-orange-400 drop-shadow-2xl" />
            </div>
            
            <span className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl animate-[bounce_3s_infinite] [animation-delay:0.2s]">t</span>
            <span className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl animate-[bounce_3s_infinite] [animation-delay:0.3s]">o</span>
            <span className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl animate-[bounce_3s_infinite] [animation-delay:0.4s]">p</span>
            <span className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl animate-[bounce_3s_infinite] [animation-delay:0.5s]">i</span>
            
            {/* Chữ "a" → thay bằng chó */}
            <div className="animate-[bounce_3s_infinite] [animation-delay:0.6s]">
              <FaDog className="h-12 w-12 text-amber-300 drop-shadow-2xl scale-x-[-1]" />
            </div>
          </span>
        </div>

        {/* Search Bar */}
        {/* <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all"
            />
          </div>
        </div> */}

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-6 text-white">
            <div className="text-right leading-tight">
              <div className="text-xs opacity-80">Hôm nay</div>
              <div className="text-lg font-bold tracking-wider animate-[gradient_6s_ease_infinite] bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                {new Date().toLocaleDateString("vi-VN", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div className="w-px h-10 bg-white/30"></div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {darkMode ? (
              <HiSun className="h-6 w-6" />
            ) : (
              <HiMoon className="h-6 w-6" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex flex-col items-center gap-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <img
                src={user?.avatarUrl || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
                alt={user?.fullName || "User"}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
              />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute top-14 right-0 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-4 text-black border-b border-gray-200">
                <p className="text-xs">Chào Admin 👋</p>
                <p className="text-base font-semibold">
                  {user?.fullName}
                </p>
              </div>

                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 transition flex items-center gap-2">
                  <HiSearch className="h-4 w-4" />
                  Hồ sơ cá nhân
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 transition flex items-center gap-2">
                  <HiCog className="h-4 w-4" />
                  Cài đặt
                </button>

                <hr className="border-gray-200 dark:border-gray-700" />

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-2 font-medium"
                >
                  <HiLogout className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;

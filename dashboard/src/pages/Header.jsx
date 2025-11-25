"use client";

import { HiBell, HiSearch, HiMoon, HiSun, HiLogout, HiCog } from "react-icons/hi";
import { useState } from "react";
import logo from "../assets/image.png";

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
            className="h-12 w-12 rounded-full object-cover"
            alt="Logo"
          />
          <span className="text-2xl font-bold text-white">Petpetopia</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <HiBell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute top-12 right-0 w-[360px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 font-semibold border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                  Notifications
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex p-4 gap-3 items-start hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <img
                        src={n.avatar || "/placeholder.svg"}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={n.name}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-semibold">{n.name}</span>{" "}
                          {n.message}
                        </p>
                        {n.action && (
                          <div className="mt-2 flex gap-2">
                            <button className="px-3 py-1 text-sm bg-[#7b4f35] text-white rounded-md hover:bg-[#6a4330] transition">
                              Accept
                            </button>
                            <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                              Decline
                            </button>
                          </div>
                        )}
                        <span className="text-xs text-[#7b4f35] mt-1 block">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center p-3 border-t border-gray-200 dark:border-gray-700 text-sm text-[#7b4f35] hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition">
                  View all
                </div>
              </div>
            )}
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
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-black dark:text-white">Chào {user?.fullName || "User"}</p>
                  <p className="text-sm text-black dark:text-gray-400">{user?.email || "admin@petopia.com"}</p>
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

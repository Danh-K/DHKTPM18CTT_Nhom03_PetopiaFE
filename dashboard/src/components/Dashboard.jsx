"use client";
import React from "react";
import {
  FaPaw,
  FaUsers,
  FaDollarSign,
  FaClipboardList,
  FaCommentDots,
  FaHeart,
  FaStar,
  FaBell,
  FaBolt,
  FaChartLine,
  FaEllipsisH,
  FaShoppingBag,
  FaCrown,
  FaPlus,
  FaArrowUp,
  FaCalendarAlt, // Icon lịch cho dropdown
} from "react-icons/fa";
import { HiTrendingUp, HiOutlineClock } from "react-icons/hi";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts";
import { useDashboardOverview } from "../hooks/useDashboardOverview";

// --- Dữ liệu giả cho biểu đồ trang trí trên Banner ---
const sparkData = [
  { val: 40 },
  { val: 30 },
  { val: 65 },
  { val: 50 },
  { val: 80 },
  { val: 95 },
];

export default function DashboardOverview() {
  const {
    loading,
    general,
    activities,
    social,
    liveVisitors,
    revenueChart,
    topUsers,
    yearStats, // Dữ liệu thống kê tổng năm
    selectedYear, // Năm đang chọn
    setSelectedYear, // Hàm thay đổi năm
    formatCurrency,
    formatTime,
  } = useDashboardOverview();

  // Animation Variants
  const containerVar = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVar = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
          <span className="text-indigo-600 font-medium">
            Đang tải dữ liệu {selectedYear}...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVar}
        initial="hidden"
        animate="visible"
      >
        {/* 1. HEADER & WELCOME BANNER */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              Tổng quan hệ thống
            </h1>
            <p className="text-slate-500 text-sm">
              Chào mừng quay trở lại, Admin!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 cursor-pointer transition">
              <FaBell className="text-slate-400 text-lg" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex items-center gap-3 bg-white py-1.5 px-3 rounded-full shadow-sm border border-slate-100">
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff"
                alt="Admin"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-bold text-slate-700">
                Administrator
              </span>
            </div>
          </div>
        </header>

        {/* BANNER */}
        <motion.div
          variants={itemVar}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-8 shadow-xl shadow-indigo-200"
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
                Hệ thống ổn định! <FaChartLine className="opacity-80" />
              </h2>
              <p className="opacity-90 mb-6 max-w-lg text-indigo-100">
                Hiện tại có{" "}
                <strong className="text-yellow-300 text-xl">
                  {liveVisitors}
                </strong>{" "}
                người đang truy cập. Các chỉ số kinh doanh đang tăng trưởng tích
                cực trong tháng này.
              </p>
              <button className="px-6 py-2.5 bg-white text-indigo-600 font-bold rounded-full hover:bg-indigo-50 transition-all shadow-md text-sm">
                Xem báo cáo chi tiết
              </button>
            </div>

            {/* Mini Decoration Chart */}
            <div className="w-48 h-24 hidden md:block opacity-90 filter drop-shadow-lg">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fff" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#fff"
                    strokeWidth={3}
                    fill="url(#colorVal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-yellow-400 opacity-20 blur-2xl"></div>
        </motion.div>

        {/* 2. KEY METRICS (4 Cards) */}
        <motion.div
          variants={itemVar}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <MetricCard
            title="Tổng Doanh Thu"
            value={general.totalRevenue}
            isCurrency
            icon={<FaDollarSign />}
            color="bg-emerald-500"
            trend="+12.5%"
          />
          <MetricCard
            title="Thú Cưng Mới"
            value={general.newPets}
            icon={<FaPaw />}
            color="bg-orange-500"
            trend="+5"
          />
          <MetricCard
            title="Khách Hàng Mới"
            value={general.newCustomers}
            icon={<FaUsers />}
            color="bg-blue-500"
            trend="+2"
          />
          <MetricCard
            title="Đơn Đang Xử Lý"
            value={general.ordersProcessing}
            icon={<FaShoppingBag />}
            color="bg-purple-500"
            subText="Cần xử lý gấp"
            isPending
          />
        </motion.div>

        {/* 3. MAIN CHART + ACTIVITY FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Revenue & Profit Chart (2/3) */}
          <motion.div
            variants={itemVar}
            className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            {/* --- HEADER BIỂU ĐỒ --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <HiTrendingUp className="text-indigo-500 text-xl" /> Hiệu Quả
                  Kinh Doanh
                </h3>

                {/* DROPDOWN CHỌN NĂM */}
                <div className="flex items-center gap-2 mt-1 mb-2">
                  <p className="text-sm text-slate-500 font-medium">
                    Năm tài chính:
                  </p>
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="appearance-none bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold py-1.5 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all hover:bg-indigo-100"
                    >
                      <option value={2023}>2023</option>
                      <option value={2024}>2024</option>
                      <option value={2025}>2025</option>
                      <option value={2026}>2026</option>
                    </select>
                    <FaCalendarAlt className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-400 text-xs pointer-events-none" />
                  </div>
                </div>

                {/* --- HIỂN THỊ CON SỐ TREND & TỔNG --- */}
                <div className="flex items-baseline gap-3 mt-2">
                  <h4 className="text-2xl font-extrabold text-slate-800">
                    {formatCurrency(yearStats.totalRevenue)}
                  </h4>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                    <FaArrowUp size={10} /> {yearStats.growth}%
                    <span className="font-normal text-slate-400 hidden sm:inline">
                      vs năm ngoái
                    </span>
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-3">
                <span className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>{" "}
                  Doanh thu
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>{" "}
                  Lợi nhuận
                </span>
              </div>
            </div>

            {/* CHART CONTAINER */}
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueChart}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `${val / 1000000}M`}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(val) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(val)
                    }
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      fontWeight: "bold",
                      color: "#1e293b",
                    }}
                  />
                  {/* Doanh thu dạng Area */}
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                    animationDuration={1500}
                  />
                  {/* Lợi nhuận dạng Line */}
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Lợi nhuận"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#10b981",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    animationDuration={1500}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* RIGHT: Top Users (1/3) */}
          <motion.div
            variants={itemVar}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <FaUsers className="text-blue-500 text-xl" /> Top Khách Hàng
              </h3>
              <FaEllipsisH className="text-slate-400 cursor-pointer" />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[350px] pr-1 space-y-4 custom-scrollbar">
              {topUsers.length === 0 && (
                <p className="text-center text-slate-400 text-sm mt-10">
                  Chưa có dữ liệu khách hàng
                </p>
              )}
              {topUsers.map((user, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-sm
                                ${
                                  idx === 0
                                    ? "bg-yellow-400"
                                    : idx === 1
                                    ? "bg-gray-400"
                                    : idx === 2
                                    ? "bg-orange-400"
                                    : "bg-blue-300"
                                }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="relative">
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${user.fullName}`
                        }
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        alt={user.fullName}
                      />
                      {idx === 0 && (
                        <FaCrown className="absolute -top-2 -right-1 text-yellow-500 text-xs drop-shadow" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {user.fullName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {user.totalOrders} đơn hàng
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-indigo-600">
                      {formatCurrency(user.totalSpent)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 4. SOCIAL & PETS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* TOP LIKED PETS */}
          <motion.div
            variants={itemVar}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <FaHeart className="text-rose-500 text-xl" /> Thú Cưng Yêu Thích
              </h3>
              <button className="text-xs text-indigo-600 hover:underline">
                Xem tất cả
              </button>
            </div>
            <div className="space-y-4">
              {social.topLikedPets?.length === 0 && (
                <p className="text-slate-400 text-sm italic text-center py-10">
                  Chưa có dữ liệu yêu thích.
                </p>
              )}
              {social.topLikedPets?.map((pet, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between group p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                      <FaPaw className="text-slate-300 text-xl" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition">
                        {pet.petName}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {formatCurrency(pet.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1 rounded-full text-rose-500 font-bold text-xs">
                    <FaHeart /> {pet.totalLikes}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RECENT REVIEWS */}
          <motion.div
            variants={itemVar}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <FaCommentDots className="text-blue-500 text-xl" /> Bình Luận
                Mới
              </h3>
              <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded">
                {social.totalComments} total
              </span>
            </div>

            <div className="space-y-4">
              {social.recentReviews?.length === 0 && (
                <p className="text-slate-400 text-sm italic text-center py-10">
                  Chưa có bình luận nào.
                </p>
              )}
              {social.recentReviews?.map((review, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <img
                    src={
                      review.userAvatar ||
                      `https://ui-avatars.com/api/?name=${review.userName}&background=random`
                    }
                    alt="user"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm mt-1"
                  />
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {review.userName}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          về{" "}
                          <span className="font-semibold text-indigo-600">
                            {review.petName}
                          </span>
                        </p>
                      </div>
                      <div className="flex text-yellow-400 text-[10px]">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-slate-200"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 italic mb-2">
                      "{review.comment}"
                    </p>
                    <p className="text-[10px] text-slate-400 text-right font-medium">
                      {formatTime(review.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 5. ACTIVITY FEED & QUICK ACTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity (2/3) */}
          <motion.div
            variants={itemVar}
            className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <HiOutlineClock className="text-orange-500 text-xl" /> Timeline
                Hoạt Động
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 space-y-5 custom-scrollbar">
              {activities?.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-10">
                  Chưa có hoạt động nào
                </p>
              )}
              {activities?.map((act, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {/* Timeline Line */}
                  {idx !== activities.length - 1 && (
                    <div className="absolute left-[14px] top-8 bottom-[-20px] w-[2px] bg-slate-100"></div>
                  )}
                  {/* Icon */}
                  <div
                    className={`z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm shrink-0 mt-1 text-white
                                ${
                                  act.activityType === "ORDER"
                                    ? "bg-blue-500"
                                    : "bg-green-500"
                                }`}
                  >
                    {act.activityType === "ORDER" ? (
                      <FaClipboardList size={12} />
                    ) : (
                      <FaBolt size={12} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-bold text-slate-800">
                        {act.customerName}
                      </p>
                      <span className="text-[10px] font-medium text-slate-400">
                        {formatTime(act.time)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">
                      {act.description}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide
                                            ${
                                              act.status === "DELIVERED"
                                                ? "bg-green-100 text-green-700"
                                                : act.status === "PENDING"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-slate-100 text-slate-600"
                                            }`}
                      >
                        {act.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions (1/3) */}
          <motion.div
            variants={itemVar}
            className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 rounded-3xl shadow-lg text-white flex flex-col justify-center"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <FaBolt className="text-yellow-400" /> Thao tác nhanh
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border border-white/10">
                <FaPlus className="text-2xl text-emerald-400" />
                <span className="text-xs font-bold">Thêm Pet</span>
              </button>
              <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border border-white/10">
                <FaClipboardList className="text-2xl text-blue-400" />
                <span className="text-xs font-bold">Đơn Hàng</span>
              </button>
              <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border border-white/10">
                <FaUsers className="text-2xl text-purple-400" />
                <span className="text-xs font-bold">Khách Hàng</span>
              </button>
              <button className="p-4 bg-white/10 hover:bg-white/20 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border border-white/10">
                <FaChartLine className="text-2xl text-orange-400" />
                <span className="text-xs font-bold">Báo Cáo</span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// --- SUB COMPONENTS ---

const MetricCard = ({
  title,
  value,
  icon,
  color, // Class background (bg-emerald-500)
  isCurrency,
  trend,
  subText,
  isPending,
}) => {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
            {isCurrency ? (
              <CountUp end={value} duration={2} separator="." suffix=" ₫" />
            ) : (
              <CountUp end={value} duration={2} />
            )}
          </h3>
        </div>
        <div
          className={`p-3.5 rounded-2xl text-white shadow-lg transform rotate-3 ${color}`}
        >
          <span className="text-xl">{icon}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 relative z-10">
        {trend && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
            <FaArrowUp /> {trend}{" "}
            <span className="font-medium text-emerald-400 hidden sm:inline">
              tháng này
            </span>
          </span>
        )}
        {isPending && (
          <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
            <FaClipboardList /> Cần xử lý ngay
          </span>
        )}
        {subText && !isPending && (
          <span className="text-xs text-slate-400">{subText}</span>
        )}
      </div>

      {/* Decoration */}
      <div
        className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-xl ${color}`}
      ></div>
    </div>
  );
};

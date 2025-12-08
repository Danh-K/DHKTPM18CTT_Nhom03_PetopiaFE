"use client";

import { useState, useEffect } from "react";
import {
  HiCurrencyDollar,
  HiShoppingCart,
  HiClock,
  HiXCircle,
  HiChartPie,
  HiDownload,
  HiFilter,
} from "react-icons/hi";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useDashboard } from "../../hooks/useDashboard";
import CountUp from "react-countup";

// --- HELPER FORMAT AXIS (Để ngoài component) ---
const formatYAxis = (value) => {
  if (value === 0) return "0";
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`; // Tỷ
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`; // Triệu (bỏ thập phân)
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`; // Nghìn
  return value;
};

export default function Revenue() {
  const {
    loading,
    mainStats,
    revenueChartData,
    orderStatusData,
    selectedYear,
    setSelectedYear,
    dateRange,
    setDateRange,
    fetchRevenueDashboardData,
    fetchRevenueChart,
    exportToPDF,
  } = useDashboard();

  const [selectedTab, setSelectedTab] = useState(0);
  const COLORS = { primary: "#4F46E5", secondary: "#10B981" };
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // 1. Load lần đầu
  useEffect(() => {
    fetchRevenueDashboardData();
  }, []);

  // 2. Đổi Năm -> Gọi lại chart ngay
  const handleYearChange = (e) => {
    const year = Number(e.target.value);
    setSelectedYear(year);
    fetchRevenueChart(year);
  };

  // 3. Đổi Ngày -> Chỉ set state
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Bấm Lọc -> Gọi API
  const handleFilterSubmit = () => {
    fetchRevenueDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <span className="mt-4 text-indigo-600 font-medium">
            Đang tải dữ liệu...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                <HiChartPie className="text-indigo-600" /> Dashboard Thống Kê
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                Tổng hợp số liệu kinh doanh
              </p>
            </div>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg transition-all active:scale-95"
            >
              <HiDownload /> Xuất Báo Cáo PDF
            </button>
          </div>

          {/* FILTER BAR */}
          <div className="flex flex-wrap items-end gap-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Từ ngày
              </span>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Đến ngày
              </span>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button
              onClick={handleFilterSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-bold shadow-sm transition-all h-[38px]"
            >
              <HiFilter /> Lọc Dữ Liệu
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Năm biểu đồ
              </span>
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* CARDS TỔNG QUAN */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatsCard
            title="Doanh Thu (Theo Lọc)"
            value={mainStats.revenueThisMonth}
            isCurrency
            icon={<HiCurrencyDollar size={28} />}
            color="indigo"
            subText="Khoảng thời gian đã chọn"
          />
          <StatsCard
            title="Tổng Đơn Hàng"
            value={mainStats.totalOrders}
            icon={<HiShoppingCart size={28} />}
            color="emerald"
            subText="Đã đặt hàng"
          />
          <StatsCard
            title="Đơn Đặt Trước"
            value={mainStats.totalPreBookings}
            icon={<HiClock size={28} />}
            color="amber"
            isNegative
            subText="Pre-order"
          />
          <StatsCard
            title="Đơn Đã Hủy"
            value={mainStats.cancelledOrders}
            icon={<HiXCircle size={28} />}
            color="rose"
            bg="bg-white"
            subText="Đã hủy"
          />
        </motion.div>

        {/* TABS */}
        <Tabs
          selectedIndex={selectedTab}
          onSelect={(index) => setSelectedTab(index)}
          className="outline-none"
        >
          <TabList className="flex gap-2 mb-6 bg-slate-200/50 p-1 rounded-xl w-fit">
            {["Tổng Quan", "Doanh Thu & Lợi Nhuận", "Phân Tích Đơn Hàng"].map(
              (title, index) => (
                <Tab
                  key={index}
                  className={`px-6 py-2.5 cursor-pointer font-bold text-sm rounded-lg outline-none transition-all duration-300 ${
                    selectedTab === index
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                  }`}
                >
                  {title}
                </Tab>
              )
            )}
          </TabList>

          {/* TAB 1: AREA CHART */}
          <TabPanel>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  Xu Hướng Doanh Thu (Năm {selectedYear})
                </h3>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.primary}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.primary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E2E8F0"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748B", fontSize: 12 }}
                      dy={10}
                    />

                    {/* Y-AXIS FIXED HERE */}
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748B", fontSize: 12 }}
                      tickFormatter={formatYAxis} // SỬ DỤNG HÀM MỚI
                      width={80}
                      domain={[0, "auto"]} // FIX LỖI FLAT LINE
                    />

                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={COLORS.primary}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabPanel>

          {/* TAB 2: COMPOSED CHART */}
          <TabPanel>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                  Chi Tiết Doanh Thu & Lợi Nhuận ({selectedYear})
                </h3>
              </div>
              <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={revenueChartData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid stroke="#f3f4f6" vertical={false} />
                    <XAxis
                      dataKey="month"
                      scale="point"
                      padding={{ left: 30, right: 30 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    {/* Y-AXIS FIXED HERE */}
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={formatYAxis} // SỬ DỤNG HÀM MỚI
                      width={80}
                      domain={[0, "auto"]} // FIX LỖI FLAT LINE
                    />

                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      wrapperStyle={{ paddingBottom: "20px" }}
                    />
                    <Bar
                      dataKey="revenue"
                      name="Doanh Thu"
                      barSize={30}
                      fill={COLORS.primary}
                      radius={[6, 6, 0, 0]}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      name="Lợi Nhuận"
                      stroke={COLORS.secondary}
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        fill: COLORS.secondary,
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabPanel>

          {/* TAB 3: PIE CHART (Không đổi nhiều) */}
          <TabPanel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Tỷ Lệ Đơn Hàng
                </h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={8}
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6">
                  Chi Tiết Trạng Thái
                </h3>
                <div className="space-y-4">
                  {orderStatusData.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-bold text-slate-700 text-base">
                          {item.name}
                        </span>
                      </div>
                      <span className="block text-xl font-extrabold text-slate-800">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---
const StatsCard = ({ title, value, icon, color, subText, isCurrency }) => {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-800">
            {isCurrency ? (
              <CountUp
                end={Number(value) || 0}
                duration={1.5}
                separator="."
                suffix=" ₫"
              />
            ) : (
              <CountUp end={Number(value) || 0} duration={1.5} />
            )}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>{icon}</div>
      </div>
      {subText && (
        <div className="mt-4 text-xs font-bold text-slate-400">{subText}</div>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-xl z-50">
        <p className="text-sm font-bold text-slate-700 mb-2">{`Tháng ${label?.replace(
          "T",
          ""
        )}`}</p>
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-xs font-semibold mb-1"
            style={{ color: entry.color }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color || entry.fill }}
            ></span>
            <span>
              {entry.name === "revenue"
                ? "Doanh Thu"
                : entry.name === "profit"
                ? "Lợi Nhuận"
                : entry.name}
              :
            </span>
            <span>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

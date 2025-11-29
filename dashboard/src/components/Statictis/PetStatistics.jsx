"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPaw } from "react-icons/fa";
import {
  TrendingUp,
  TrendingDown,
  Crown,
  CalendarIcon,
  X,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
} from "recharts";

// Import thư viện PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Import Hook
import { useDashboard } from "../../hooks/useDashboard";

// --- HELPER: CHUYỂN TIẾNG VIỆT CÓ DẤU SANG KHÔNG DẤU (ĐỂ KHÔNG LỖI FONT PDF) ---
const removeVietnameseTones = (str) => {
  if (!str) return "";
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
};

export default function PetStatistics() {
  // --- SỬ DỤNG HOOK ---
  const {
    loading,
    generalStats,
    topSelling,
    topUsers,
    healthStats,
    fetchPetDashboardData,
  } = useDashboard();

  useEffect(() => {
    fetchPetDashboardData();
  }, [fetchPetDashboardData]);
  // --------------------

  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // --- XỬ LÝ XUẤT PDF (TIẾNG ANH) ---
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString("en-GB");

    // 1. Header Background
    doc.setFillColor(236, 72, 153); // Pink-500
    doc.rect(0, 0, 210, 40, "F");

    // 2. Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("PETOPIA - STATISTICAL REPORT", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Export Date: ${dateStr}`, 105, 30, { align: "center" });

    // 3. General Stats Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("1. General Overview", 14, 55);

    const generalData = [
      ["Category", "Value"],
      ["Total Pets Sold", generalStats?.totalSoldPets || 0],
      ["Shipping Orders", generalStats?.shippingOrders || 0],
      ["Scheduled Vaccines", generalStats?.scheduledVaccines || 0],
      [
        "Total Revenue",
        `$ ${new Intl.NumberFormat("en-US").format(
          generalStats?.totalRevenue || 0
        )}`,
      ],
    ];

    autoTable(doc, {
      startY: 60,
      head: [generalData[0]],
      body: generalData.slice(1),
      theme: "grid",
      headStyles: { fillColor: [236, 72, 153] }, // Pink header
    });

    // 4. Top Selling Pets Section
    let finalY = doc.lastAutoTable.finalY + 15;
    doc.text("2. Top Selling Pets", 14, finalY);

    const sellingRows = topSelling.map((item) => [
      removeVietnameseTones(item.name), // Chuyển tên thú cưng sang không dấu
      item.sales,
      `$ ${new Intl.NumberFormat("en-US").format(item.revenue)}`,
    ]);

    autoTable(doc, {
      startY: finalY + 5,
      head: [["Pet Name", "Quantity Sold", "Revenue"]],
      body: sellingRows,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] }, // Blue header
    });

    // 5. Top Customers Section
    finalY = doc.lastAutoTable.finalY + 15;
    // Check nếu trang hết chỗ thì sang trang mới
    if (finalY > 250) {
      doc.addPage();
      finalY = 20;
    }
    doc.text("3. VIP Customers", 14, finalY);

    const userRows = topUsers.map((u) => [
      u.rank,
      removeVietnameseTones(u.name), // Chuyển tên user sang không dấu
      u.email,
      u.purchases,
      `$ ${u.amount.replace(/[^0-9.-]+/g, "")}`, // Lấy số từ string format currency việt nam
    ]);

    autoTable(doc, {
      startY: finalY + 5,
      head: [["Rank", "Customer Name", "Email", "Orders", "Total Spent"]],
      body: userRows,
      theme: "striped",
      headStyles: { fillColor: [245, 158, 11] }, // Orange header
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("Page " + i + " of " + pageCount, 196, 290, { align: "right" });
      doc.text("Petopia Management System", 14, 290);
    }

    doc.save(`Petopia_Report_${dateStr.replace(/\//g, "-")}.pdf`);
  };

  // --- CHART DATA GIỮ NGUYÊN ---
  const salesData = [
    { month: "Jan", sold: 12, revenue: 120 },
    { month: "Feb", sold: 19, revenue: 198 },
    { month: "Mar", sold: 15, revenue: 165 },
    { month: "Apr", sold: 22, revenue: 245 },
    { month: "May", sold: 28, revenue: 302 },
    { month: "Jun", sold: 24, revenue: 258 },
    { month: "Jul", sold: 30, revenue: 312 },
    { month: "Aug", sold: 35, revenue: 365 },
    { month: "Sep", sold: 31, revenue: 323 },
    { month: "Oct", sold: 29, revenue: 289 },
    { month: "Nov", sold: 33, revenue: 378 },
    { month: "Dec", sold: 40, revenue: 425 },
  ];

  const statsCards = [
    {
      title: "Thú Cưng Đã Bán",
      value: generalStats?.totalSoldPets || 0,
      change: "+12.5%",
      trend: "up",
      color: "pink",
      icon: "📦",
    },
    {
      title: "Đang Vận Chuyển",
      value: generalStats?.shippingOrders || 0,
      change: "+8.2%",
      trend: "up",
      color: "blue",
      icon: "🚚",
    },
    {
      title: "Lịch Vaccine Sắp Tới",
      value: generalStats?.scheduledVaccines || 0,
      change: "+2.4%",
      trend: "up",
      color: "orange",
      icon: "💉",
    },
    {
      title: "Tổng Doanh Thu",
      value: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(generalStats?.totalRevenue || 0),
      change: "+15.3%",
      trend: "up",
      color: "green",
      icon: "💰",
    },
  ];

  const colorClasses = {
    pink: {
      bg: "bg-gradient-to-br from-pink-50 to-rose-50",
      border: "border-pink-200",
      text: "text-pink-600",
      badge: "bg-pink-100 text-pink-700",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
      border: "border-blue-200",
      text: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
    },
    orange: {
      bg: "bg-gradient-to-br from-orange-50 to-amber-50",
      border: "border-orange-200",
      text: "text-orange-600",
      badge: "bg-orange-100 text-orange-700",
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-emerald-50",
      border: "border-green-200",
      text: "text-green-600",
      badge: "bg-green-100 text-green-700",
    },
  };

  const rankColors = {
    1: "bg-gradient-to-br from-yellow-400 to-amber-500",
    2: "bg-gradient-to-br from-gray-300 to-gray-400",
    3: "bg-gradient-to-br from-orange-400 to-amber-600",
  };
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-bold text-sm"
      >{`${(percent * 100).toFixed(0)}%`}</text>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg">
              <FaPaw className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 text-balance">
                Quản Lý Thú Cưng
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Thống kê và phân tích dữ liệu
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-pink-300 transition-colors bg-white font-medium text-sm">
              <CalendarIcon className="h-4 w-4 text-pink-500" />
              <span>
                {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
              </span>
            </button>

            {/* NÚT EXPORT PDF MỚI */}
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-medium text-sm shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {statsCards.map((stat) => {
            const colors = colorClasses[stat.color];
            return (
              <motion.div
                key={stat.title}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.2 }}
                className={`${colors.bg} ${colors.border} border-2 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{stat.icon}</div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${colors.badge}`}
                  >
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  {stat.title}
                </h3>
                <p
                  className={`text-2xl font-bold ${colors.text} truncate`}
                  title={stat.value}
                >
                  {stat.value}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Row 1 */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Best Selling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Thú Cưng Bán Chạy Nhất
                </h2>
                <p className="text-sm text-gray-500 mt-1">Top 10 sản phẩm</p>
              </div>
              <div className="text-2xl">🏆</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topSelling}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  cursor={{ fill: "rgba(236, 72, 153, 0.1)" }}
                />
                <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                  {topSelling.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pet Health */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Tình Trạng Sức Khỏe
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Thống kê tiêm chủng
                </p>
              </div>
              <div className="text-2xl">🏥</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={healthStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {healthStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-sm text-gray-700">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Charts Row 2 - Top Users */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Sales Chart (Line) */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Biểu Đồ Doanh Số
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Số lượng bán và doanh thu theo tháng
                  </p>
                </div>
                <div className="text-2xl">📈</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="line"
                    formatter={(value) => (
                      <span className="text-sm text-gray-700">
                        {value === "sold"
                          ? "Số Lượng Bán"
                          : "Doanh Thu (triệu)"}
                      </span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="sold"
                    stroke="#ec4899"
                    strokeWidth={3}
                    dot={{ fill: "#ec4899", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Top Customers */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Khách Hàng VIP
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Top 5 mua nhiều nhất
                </p>
              </div>
              <Crown className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="space-y-3">
              {topUsers.map((customer, index) => (
                <motion.div
                  key={customer.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-pink-300 transition-all"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm ${
                      customer.rank <= 3
                        ? rankColors[customer.rank]
                        : "bg-gradient-to-br from-gray-400 to-gray-500"
                    }`}
                  >
                    {customer.rank}
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 text-2xl border border-gray-200">
                    {customer.avatar.includes("http") ? (
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      customer.avatar
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-gray-900 text-sm truncate"
                      title={customer.name}
                    >
                      {customer.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {customer.purchases} đơn hàng
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-600 text-sm">
                      {customer.amount}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

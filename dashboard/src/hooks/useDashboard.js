import { useState, useCallback } from "react";
import dashboardApi from "../api/dashboardApi";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper: Xóa dấu tiếng Việt để xuất PDF không lỗi font
const removeVietnameseTones = (str) => {
  if (!str) return "";
  str = str.toString().replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
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

export const useDashboard = () => {
  const [loading, setLoading] = useState(false);

  // ==========================================
  // 1. STATE CHO PET STATISTICS (TRANG CŨ)
  // ==========================================
  const [generalStats, setGeneralStats] = useState({
    totalSoldPets: 0,
    shippingOrders: 0,
    scheduledVaccines: 0,
    totalRevenue: 0,
  });
  const [topSelling, setTopSelling] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [healthStats, setHealthStats] = useState([]);

  // ==========================================
  // 2. STATE CHO REVENUE DASHBOARD (TRANG MỚI)
  // ==========================================
  const [mainStats, setMainStats] = useState({
    revenueToday: 0,
    revenueThisWeek: 0,
    revenueThisMonth: 0,
    totalOrders: 0,
    totalPreBookings: 0,
    cancelledOrders: 0,
  });
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // Thêm filter ngày cho Revenue
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  // ==========================================
  // 3. HELPER FUNCTIONS
  // ==========================================
  const formatCurrencyShort = (value) => {
    if (value >= 1000000000) return (value / 1000000000).toFixed(1) + "B";
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
    if (value >= 1000) return (value / 1000).toFixed(1) + "K";
    return value;
  };

  const formatCurrency = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  const getSafeData = (res) => {
    if (!res) return null;
    return res.data || res;
  };

  // ==========================================
  // 4. FETCH DATA CHO PET STATISTICS (Logic Cũ)
  // ==========================================
  const fetchPetDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Sử dụng .catch(() => null) để 1 API lỗi không làm chết cả trang
      const [resGeneral, resTopUsers, resTopSelling, resHealth] =
        await Promise.all([
          dashboardApi.getGeneralStats().catch(() => null),
          dashboardApi.getTopUsers().catch(() => null),
          dashboardApi.getTopSelling().catch(() => null),
          dashboardApi.getHealthChart().catch(() => null),
        ]);

      // -- General --
      const genData = getSafeData(resGeneral);
      if (genData) {
        setGeneralStats({
          totalSoldPets: genData.totalSoldPets || 0,
          shippingOrders: genData.shippingOrders || 0,
          scheduledVaccines: genData.scheduledVaccines || 0,
          totalRevenue: genData.totalRevenue || 0,
        });
      }

      // -- Top Selling --
      const sellData = getSafeData(resTopSelling);
      const colors = [
        "#ec4899",
        "#8b5cf6",
        "#3b82f6",
        "#06b6d4",
        "#f59e0b",
        "#10b981",
      ];
      if (Array.isArray(sellData)) {
        setTopSelling(
          sellData.map((item, index) => ({
            name: item.petName,
            sales: item.totalSold,
            revenue: item.revenue,
            color: colors[index % colors.length],
          }))
        );
      }

      // -- Top Users --
      const userData = getSafeData(resTopUsers);
      if (Array.isArray(userData)) {
        setTopUsers(
          userData.map((u, index) => ({
            name: u.fullName || "Khách hàng",
            purchases: u.totalOrders,
            amount: formatCurrency(u.totalSpent),
            avatar: u.avatar || "👤",
            rank: index + 1,
            email: u.email,
          }))
        );
      }

      // -- Health --
      const healthData = getSafeData(resHealth);
      if (healthData) {
        const mappedHealth = [
          {
            name: "Khỏe Mạnh",
            value: healthData.healthyPets || 0,
            color: "#10b981",
          },
          {
            name: "Đã Tiêm Chủng",
            value: healthData.vaccinatedPets || 0,
            color: "#3b82f6",
          },
          {
            name: "Sắp Tới Lịch Tiêm",
            value: healthData.upcomingVaccines || 0,
            color: "#f59e0b",
          },
        ];
        setHealthStats(mappedHealth.filter((i) => i.value > 0));
      }
    } catch (error) {
      console.error("Lỗi tải Pet Dashboard:", error);
      toast.error("Không thể tải dữ liệu thống kê thú cưng");
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // 5. FETCH DATA CHO REVENUE DASHBOARD (Logic Mới)
  // ==========================================
  const extractData = (res) => {
    if (!res) return null;
    // Trường hợp 1: res là mảng luôn (ít gặp nếu dùng wrapper)
    if (Array.isArray(res)) return res;
    // Trường hợp 2: res.data là dữ liệu cần lấy
    if (res.data) return res.data;
    // Trường hợp 3: res chính là object dữ liệu
    return res;
  };
  const fetchRevenueChart = useCallback(async (year) => {
    try {
      // Gọi API
      const res = await dashboardApi.getRevenueChart(year).catch((err) => {
        console.error("Chart API Error:", err);
        return null;
      });

      const rawData = extractData(res);
      console.log(">>> Raw Data from API:", rawData); // [DEBUG 1] Xem dữ liệu gốc

      // 1. Tạo khung dữ liệu cho 12 tháng (Mặc định là 0)
      const fullYearData = Array.from({ length: 12 }, (_, i) => ({
        month: `T${i + 1}`, // Label: T1, T2...
        revenue: 0,
        profit: 0,
      }));

      // 2. Map dữ liệu từ API vào khung
      if (Array.isArray(rawData)) {
        rawData.forEach((item) => {
          // Chuyển đổi sang số để đảm bảo an toàn
          const monthIndex = parseInt(item.month);
          const revenue = parseFloat(item.revenue);
          const profit = parseFloat(item.profit);

          // Kiểm tra tháng hợp lệ (1-12)
          if (!isNaN(monthIndex) && monthIndex >= 1 && monthIndex <= 12) {
            // Gán giá trị vào mảng (index = month - 1)
            fullYearData[monthIndex - 1].revenue = revenue || 0;
            fullYearData[monthIndex - 1].profit = profit || 0;
          }
        });
      }

      console.log(">>> Mapped Chart Data:", fullYearData); // [DEBUG 2] Xem dữ liệu sau khi map
      setRevenueChartData(fullYearData);
    } catch (error) {
      console.error("Lỗi xử lý biểu đồ:", error);
      setRevenueChartData([]);
    }
  }, []);

  const fetchRevenueDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Truyền dateRange vào params
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };

      const [resMain, resStatus] = await Promise.all([
        dashboardApi.getMainStats(params).catch(() => null),
        dashboardApi.getOrderStatusStats(params).catch(() => null),
      ]);

      // Map Main Stats
      const mainData = getSafeData(resMain);
      if (mainData) {
        setMainStats({
          revenueToday: Number(mainData.revenueToday) || 0,
          revenueThisWeek: Number(mainData.revenueThisWeek) || 0,
          // Nếu API trả về null, fallback về 0.
          // Lưu ý: revenueThisMonth ở đây thực chất là "Doanh thu trong khoảng thời gian lọc"
          revenueThisMonth:
            Number(mainData.revenueThisMonth) ||
            Number(mainData.totalRevenue) ||
            0,
          totalOrders: Number(mainData.totalOrders) || 0,
          totalPreBookings: Number(mainData.totalPreBookings) || 0,
          cancelledOrders: Number(mainData.cancelledOrders) || 0,
        });
      }

      // Map Order Status
      const statusData = getSafeData(resStatus);
      if (statusData) {
        const mappedStatus = [
          {
            name: "Thành công",
            value: Number(statusData.delivered) || 0,
            color: "#10b981",
          },
          {
            name: "Đang xử lý",
            value:
              (Number(statusData.pending) || 0) +
              (Number(statusData.confirmed) || 0),
            color: "#f59e0b",
          },
          {
            name: "Đang giao",
            value: Number(statusData.shipped) || 0,
            color: "#3b82f6",
          },
          {
            name: "Đã hủy",
            value: Number(statusData.cancelled) || 0,
            color: "#ef4444",
          },
        ];
        setOrderStatusData(mappedStatus.filter((i) => i.value > 0));
      }

      // Gọi luôn chart theo năm đang chọn
      await fetchRevenueChart(selectedYear);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, dateRange, fetchRevenueChart]);

  // ==========================================
  // 6. EXPORT PDF (Tính năng mới)
  // ==========================================
  const exportToPDF = () => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString("en-GB");

    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("PETOPIA - BUSINESS REPORT", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Date: ${dateStr}`, 105, 30, { align: "center" });

    let finalY = 50;

    // Summary
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("1. Business Summary", 14, finalY);
    const summaryData = [
      ["Metric", "Value"],
      [
        "Total Revenue (Month)",
        `${new Intl.NumberFormat("en-US").format(
          mainStats.revenueThisMonth
        )} VND`,
      ],
      ["Total Orders", mainStats.totalOrders],
      ["Pre-Orders", mainStats.totalPreBookings],
      ["Cancelled Orders", mainStats.cancelledOrders],
    ];
    autoTable(doc, {
      startY: finalY + 5,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
    });

    finalY = doc.lastAutoTable.finalY + 15;

    // Revenue Table
    doc.text(`2. Monthly Revenue (${selectedYear})`, 14, finalY);
    const revenueRows = revenueChartData.map((d) => [
      d.month.replace("T", "Month "),
      `${new Intl.NumberFormat("en-US").format(d.revenue)} VND`,
      `${new Intl.NumberFormat("en-US").format(d.profit)} VND`,
    ]);
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Month", "Revenue", "Estimated Profit"]],
      body: revenueRows,
      theme: "striped",
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.save(`Petopia_Report_${dateStr.replace(/\//g, "-")}.pdf`);
    toast.success("Xuất báo cáo thành công!");
  };

  // ==========================================
  // RETURN
  // ==========================================
  return {
    loading,
    // Data & Func cho PetStatistics.jsx
    generalStats,
    topSelling,
    topUsers,
    healthStats,
    fetchPetDashboardData,

    // Data & Func cho Revenue.jsx
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

    // Helpers
    formatCurrency,
    formatCurrencyShort,
  };
};

import { useState, useEffect, useCallback } from "react";
import dashboardApi from "../api/dashboardApi";

export const useDashboardOverview = () => {
  const [loading, setLoading] = useState(true);

  // --- STATE DỮ LIỆU ---
  const [general, setGeneral] = useState({
    newPets: 0,
    newCustomers: 0,
    totalRevenue: 0,
    ordersProcessing: 0,
    newReviews: 0,
  });
  const [activities, setActivities] = useState([]);
  const [social, setSocial] = useState({
    totalLikes: 0,
    totalComments: 0,
    topLikedPets: [],
    recentReviews: [],
  });

  const [revenueChart, setRevenueChart] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [liveVisitors, setLiveVisitors] = useState(124);

  // --- STATE MỚI: YEAR STATS & SELECTED YEAR ---
  // Mặc định chọn 2025 như bạn yêu cầu
  const [selectedYear, setSelectedYear] = useState(2025);

  const [yearStats, setYearStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    growth: 15.2,
  });

  // Fake real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors((prev) =>
        Math.max(50, prev + (Math.floor(Math.random() * 10) - 5))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const extractData = (res) => {
    if (!res) return null;
    if (Array.isArray(res)) return res;
    if (res.data) return res.data;
    return res;
  };

  const fetchOverviewData = useCallback(async () => {
    setLoading(true);
    try {
      // GỌI 5 API SONG SONG
      // Lưu ý: getRevenueChart truyền selectedYear vào
      const [resGeneral, resActivities, resSocial, resChart, resUsers] =
        await Promise.all([
          dashboardApi.getOverviewGeneral().catch(() => null),
          dashboardApi.getRecentActivities().catch(() => null),
          dashboardApi.getSocialStats().catch(() => null),
          dashboardApi.getRevenueChart(selectedYear).catch(() => null), // <--- DÙNG SELECTED YEAR
          dashboardApi.getTopUsers().catch(() => null),
        ]);

      // 1. General
      const genData = extractData(resGeneral);
      if (genData) setGeneral(genData);

      // 2. Activities
      const actData = extractData(resActivities);
      if (Array.isArray(actData)) setActivities(actData);

      // 3. Social
      const socData = extractData(resSocial);
      if (socData) setSocial(socData);

      // 4. Chart (Doanh thu & Lợi nhuận)
      const chartDataRaw = extractData(resChart);
      let calculatedRevenue = 0;
      let calculatedProfit = 0;

      // Reset biểu đồ về 0 trước khi map dữ liệu mới
      const fullYear = Array.from({ length: 12 }, (_, i) => ({
        name: `T${i + 1}`,
        revenue: 0,
        profit: 0,
      }));

      if (Array.isArray(chartDataRaw)) {
        chartDataRaw.forEach((item) => {
          const m = parseInt(item.month, 10);
          if (m >= 1 && m <= 12) {
            const rev = Number(item.revenue) || 0;
            const pro = Number(item.profit) || 0;

            fullYear[m - 1].revenue = rev;
            fullYear[m - 1].profit = pro;

            calculatedRevenue += rev;
            calculatedProfit += pro;
          }
        });
      }
      setRevenueChart(fullYear);

      // Cập nhật thống kê năm
      setYearStats({
        totalRevenue: calculatedRevenue,
        totalProfit: calculatedProfit,
        growth: 15.2, // Demo %
      });

      // 5. Top Users
      const userData = extractData(resUsers);
      if (Array.isArray(userData)) setTopUsers(userData);
    } catch (error) {
      console.error("Lỗi tải Overview:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedYear]); // <--- Chạy lại khi selectedYear thay đổi

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  // Format functions
  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val || 0);

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  };

  return {
    loading,
    general,
    activities,
    social,
    liveVisitors,
    revenueChart,
    topUsers,
    yearStats,
    selectedYear, // <--- Trả về biến này
    setSelectedYear, // <--- Trả về hàm set biến này
    formatCurrency,
    formatTime,
  };
};

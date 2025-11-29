import axiosClient from "./axiosClient";

const dashboardApi = {
  // --- API CŨ ---
  getGeneralStats: () => axiosClient.get("/admin/dashboard/general"),
  getTopUsers: () => axiosClient.get("/admin/dashboard/top-users"),
  getTopSelling: () => axiosClient.get("/admin/dashboard/top-selling"),
  getHealthChart: () => axiosClient.get("/admin/dashboard/health-chart"),

  // --- API MỚI (CÓ THÊM PARAMS DATE) ---
  getMainStats: (params) =>
    axiosClient.get("/admin/dashboard/main-stats", { params }),
  getRevenueChart: (year) =>
    axiosClient.get(`/admin/dashboard/revenue-chart`, { params: { year } }),
  getOrderStatusStats: (params) =>
    axiosClient.get("/admin/dashboard/order-status", { params }),

  getOverviewGeneral: () =>
    axiosClient.get("/admin/dashboard-overview/general"),
  getRecentActivities: () =>
    axiosClient.get("/admin/dashboard-overview/activities"),
  getSocialStats: () => axiosClient.get("/admin/dashboard-overview/social"),
};

export default dashboardApi;

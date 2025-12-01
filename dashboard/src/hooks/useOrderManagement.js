import { useState, useEffect, useCallback } from "react";
import orderApi from "../api/orderApi";
import { toast } from "react-toastify";

export const useOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch danh sách đơn hàng
  const fetchOrders = useCallback(async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      // Format dữ liệu ngày gửi đi (nếu cần thiết, HTML date input trả về YYYY-MM-DD là chuẩn rồi)
      const params = {
        page: page - 1,
        size: 10,
        keyword: filters.search || null,
        status: filters.status === "All" ? null : filters.status,
        // --- THÊM HAI TRƯỜNG NÀY ---
        startDate: filters.startDate || null, // YYYY-MM-DD
        endDate: filters.endDate || null, // YYYY-MM-DD
      };

      const res = await orderApi.getAll(params);
      const data = res.data || res;
      const content = data.content || [];

      const mappedOrders = content.map((o) => ({
        id: o.orderId,
        customer: o.customerName || "Khách lẻ",
        email: "---",
        total: o.totalAmount,
        date: o.createdAt,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        itemsCount: o.orderItems ? o.orderItems.length : 0,
      }));

      setOrders(mappedOrders);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      // toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  // ... (Giữ nguyên các hàm getOrderDetail, updateStatus)
  const getOrderDetail = async (orderId) => {
    try {
      const res = await orderApi.getDetail(orderId);
      return res.data || res;
    } catch (error) {
      return null;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    orders,
    loading,
    totalPages,
    totalElements,
    fetchOrders,
    getOrderDetail,
    updateOrderStatus,
  };
};

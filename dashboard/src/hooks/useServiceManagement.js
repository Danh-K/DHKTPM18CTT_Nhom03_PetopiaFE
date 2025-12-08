import { useState, useCallback } from "react";
import serviceApi from "../api/serviceApi";
import { toast } from "react-toastify";

export const useServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Lấy danh sách dịch vụ
  const fetchServices = useCallback(
    async (keyword = "", page = 1, size = 6) => {
      setLoading(true);
      try {
        // Backend page bắt đầu từ 0, Frontend từ 1
        const params = { keyword, page: page - 1, size };
        const response = await serviceApi.getAll(params);

        // Wrapper data tùy chỉnh theo API response của bạn
        const data = response.data?.data || response.data;

        setServices(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error("Lỗi tải dịch vụ:", error);
        // toast.error("Không thể tải danh sách dịch vụ"); // Có thể bỏ nếu muốn component tự handle
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Tạo mới
  const createService = async (data, imageFile) => {
    try {
      await serviceApi.create(data, imageFile);
      toast.success("Thêm dịch vụ thành công!");
      return true; // Trả về true để component biết đóng modal
    } catch (error) {
      console.error("Create error:", error);
      toast.error(error.response?.data?.message || "Lỗi khi thêm dịch vụ");
      return false;
    }
  };

  // Cập nhật
  const updateService = async (id, data, imageFile) => {
    try {
      await serviceApi.update(id, data, imageFile);
      toast.success("Cập nhật dịch vụ thành công!");
      return true;
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật dịch vụ");
      return false;
    }
  };

  // Xóa
  const removeService = async (id) => {
    try {
      await serviceApi.delete(id);
      toast.success("Xóa dịch vụ thành công!");
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Lỗi khi xóa dịch vụ");
      return false;
    }
  };

  return {
    services,
    loading,
    totalPages,
    totalElements,
    fetchServices,
    createService,
    updateService,
    removeService,
  };
};

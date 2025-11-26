import { useState, useEffect, useCallback } from "react";
import vaccineApi from "../api/vaccineApi";
import petApi from "../api/petApi";
import { toast } from "react-toastify";

export const useVaccineManagement = () => {
  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({
    totalSchedules: 0,
    completedSchedules: 0,
    upcomingSchedules: 0,
    petsNeedVaccination: 0,
  });
  const [loading, setLoading] = useState(false);

  // --- FETCH DATA ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [vaccinesRes, petsRes, statsRes] = await Promise.all([
        vaccineApi.getAll(0, 2000),
        petApi.getAll(),
        vaccineApi.getStats(),
      ]);

      // 1. Xử lý Lịch tiêm để lấy thông tin chủ sở hữu
      const rawVaccines = vaccinesRes.data || vaccinesRes;
      const vaccineList = Array.isArray(rawVaccines)
        ? rawVaccines
        : rawVaccines.content || [];

      // Map danh sách lịch để dùng cho việc tra cứu chủ sở hữu
      const scheduleMap = {};
      vaccineList.forEach((v) => {
        if (v.petId && v.userId) {
          scheduleMap[v.petId] = { userId: v.userId, ownerName: v.ownerName };
        }
      });

      // 2. Xử lý Danh sách Thú cưng
      const rawPets = petsRes.data || petsRes;
      const petList = Array.isArray(rawPets) ? rawPets : rawPets.content || [];

      const mappedPets = petList.map((p) => {
        // Logic tìm chủ sở hữu:
        // Ưu tiên 1: Lấy từ API Pet (nếu có trả về)
        // Ưu tiên 2: Lấy từ lịch sử tiêm (scheduleMap)
        // Fallback: "U001" (để test)

        let finalOwnerId = p.userId;
        let finalOwnerName = p.ownerName;

        if (!finalOwnerId && scheduleMap[p.petId]) {
          finalOwnerId = scheduleMap[p.petId].userId;
          finalOwnerName = scheduleMap[p.petId].ownerName;
        }

        // Fallback cứng nếu vẫn không tìm thấy (để test chức năng thêm)
        if (!finalOwnerId) finalOwnerId = "U001";
        if (!finalOwnerName) finalOwnerName = "Khách vãng lai";

        return {
          petId: p.petId,
          name: p.name,
          categoryName: p.categoryName || p.category?.name,
          ownerName: finalOwnerName,
          ownerId: finalOwnerId,
          image: p.images && p.images.length > 0 ? p.images[0].imageUrl : "",
        };
      });

      console.log("Mapped Pets with Owners:", mappedPets); // Log kiểm tra
      setPets(mappedPets);

      const statsData = statsRes.data || statsRes;
      if (statsData) setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- LẤY LỊCH SỬ CHI TIẾT ---
  const fetchPetHistory = async (petId) => {
    try {
      const res = await vaccineApi.getHistoryByPet(petId);
      const data = res.data || res;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  };

  // --- ACTIONS (Create / Update / Delete) ---

  const createSchedule = async (formData, petIds, userId) => {
    try {
      // Format Date: "yyyy-MM-ddTHH:mm:ss"
      // formData.dates là mảng [startDate, endDate]
      const formatISO = (d) => {
        if (!d) return null;
        const dateObj = new Date(d);
        const tzOffset = dateObj.getTimezoneOffset() * 60000;
        return new Date(dateObj - tzOffset).toISOString().slice(0, 19);
      };

      const startDate = formatISO(formData.dates[0]);
      // Nếu người dùng chọn range, lấy date[1], nếu không lấy date[0] (tiêm trong ngày)
      const endDate = formatISO(formData.dates[1] || formData.dates[0]);

      const payload = {
        userId: userId,
        petIds: petIds,
        vaccineName: formData.vaccineName,
        // Map các trường khớp với Backend DTO
        startDate: startDate,
        endDate: endDate,
        description: formData.instructions, // Mapping instructions -> description
        note: formData.notes,
      };

      console.log("Payload Create Sending:", payload); // Debug payload

      await vaccineApi.createBatch(payload);
      toast.success("Lên lịch thành công!");
      await fetchData();
      return true;
    } catch (error) {
      console.error("Create Error:", error);
      toast.error("Lỗi: " + (error.response?.data?.message || error.message));
      return false;
    }
  };

  const updateSchedule = async (id, formData) => {
    try {
      const formatISO = (d) => {
        const dateObj = new Date(d);
        const tzOffset = dateObj.getTimezoneOffset() * 60000;
        return new Date(dateObj - tzOffset).toISOString().slice(0, 19);
      };

      const payload = {
        vaccineName: formData.vaccineName,
        startDate: formatISO(formData.dates[0]),
        endDate: formatISO(formData.dates[1] || formData.dates[0]), // Update cũng cần endDate
        note: formData.notes,
        status: formData.status,
        description: formData.instructions, // Mapping
      };

      console.log("Payload Update:", payload);

      await vaccineApi.update(id, payload);
      toast.success("Cập nhật thành công!");
      // Refresh lại lịch sử trong modal (sẽ được gọi lại từ UI)
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Lỗi cập nhật");
      return false;
    }
  };

  const deleteSchedule = async (id) => {
    try {
      await vaccineApi.delete(id);
      toast.success("Đã xóa lịch tiêm");
      await fetchData();
      return true;
    } catch (error) {
      toast.error("Lỗi khi xóa");
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    pets,
    stats,
    loading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    fetchPetHistory,
  };
};

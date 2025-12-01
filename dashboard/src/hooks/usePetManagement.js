import { useState, useEffect, useCallback } from "react";
import petApi from "../api/petApi";
import { toast } from "react-toastify";

export const usePetManagement = () => {
  const [pets, setPets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // 1. Load Categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await petApi.getCategories();
      const data = res.data || res;
      if (Array.isArray(data)) {
        setCategories(
          data.map((c) => ({ category_id: c.categoryId, name: c.name }))
        );
      }
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    }
  }, []);

  // 2. Load Pets (Giữ nguyên logic cũ)
  const fetchPets = useCallback(
    async (page = 1, searchQuery = "", filters = {}) => {
      setLoading(true);
      try {
        const res = await petApi.getAll();
        const apiData = res.data || res;
        const rawList = Array.isArray(apiData.data)
          ? apiData.data
          : apiData || [];

        let mappedPets = rawList.map((p) => ({
          pet_id: p.petId,
          name: p.name,
          description: p.description,
          category_id: p.category?.categoryId || p.categoryId || "",
          category_name: p.category?.name || p.categoryName || "Chưa phân loại",
          age: p.age,
          gender: p.gender,
          price: p.price,
          discount_price: p.discountPrice,
          stock_quantity: p.stockQuantity,
          status: p.status,
          weight: p.weight,
          height: p.height,
          color: p.color,
          fur_type: p.furType,
          health_status: p.healthStatus,
          vaccination_history: p.vaccinationHistory,
          images: (p.images || []).map((img) => ({
            image_id: img.imageId,
            image_url: img.imageUrl,
            is_thumbnail: img.isThumbnail,
            is_existing: true, // Đánh dấu ảnh cũ
          })),
        }));

        // ... (Giữ nguyên logic Filter Client-side cũ của bạn) ...
        if (searchQuery)
          mappedPets = mappedPets.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        if (filters.category_id)
          mappedPets = mappedPets.filter(
            (p) => p.category_id === filters.category_id
          );
        if (filters.status)
          mappedPets = mappedPets.filter((p) => p.status === filters.status);

        setTotalElements(mappedPets.length);
        setTotalPages(Math.ceil(mappedPets.length / 10));

        const pageSize = 10;
        const startIndex = (page - 1) * pageSize;
        setPets(mappedPets.slice(startIndex, startIndex + pageSize));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 3. SAVE (ĐÃ SỬA LOGIC BLOB JSON)
  const savePet = async (petData) => {
    try {
      const formData = new FormData();

      // A. Chuẩn bị DTO
      const oldImagesList = (petData.images || [])
        .filter((img) => img.is_existing === true)
        .map((img) => ({
          id: img.image_id,
          imageUrl: img.image_url,
          isThumbnail: img.is_thumbnail,
        }));

      const petDto = {
        petId: petData.pet_id || null,
        name: petData.name,
        description: petData.description,
        categoryId: petData.category_id,
        age: Number(petData.age),
        gender: petData.gender,
        price: Number(petData.price),
        discountPrice: Number(petData.discount_price || 0),
        stockQuantity: Number(petData.stock_quantity),
        status: petData.status,
        weight: Number(petData.weight),
        height: Number(petData.height),
        color: petData.color,
        furType: petData.fur_type,
        healthStatus: petData.health_status,
        vaccinationHistory: petData.vaccination_history,
        oldImages: oldImagesList,
      };

      // --- B. ĐÓNG GÓI JSON VÀO BLOB (FIX LỖI KHÔNG VÀO CONTROLLER) ---
      // Backend dùng @RequestPart("pet"), cần content-type là application/json
      const jsonBlob = new Blob([JSON.stringify(petDto)], {
        type: "application/json",
      });
      formData.append("pet", jsonBlob);

      // --- C. ĐÓNG GÓI FILE ---
      if (petData.images && petData.images.length > 0) {
        petData.images.forEach((img) => {
          if (img.file) {
            // Chỉ lấy ảnh mới có file object
            formData.append("files", img.file);
          }
        });
      }

      // Debug: Log formData (Chỉ check đc keys)
      console.log("Submitting Pet DTO:", petDto);

      await petApi.createOrUpdate(formData);
      toast.success(
        petData.pet_id ? "Cập nhật thành công!" : "Thêm mới thành công!"
      );
      return true;
    } catch (error) {
      console.error("Save Error:", error);
      const msg =
        error.response?.data?.message || "Lỗi lưu dữ liệu (Kiểm tra kết nối)";
      toast.error(msg);
      return false;
    }
  };

  const deletePet = async (id) => {
    try {
      await petApi.delete(id);
      toast.success("Xóa thành công!");
      return true;
    } catch (error) {
      toast.error("Lỗi khi xóa");
      return false;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    pets,
    categories,
    loading,
    totalPages,
    totalElements,
    fetchPets,
    savePet,
    deletePet,
  };
};

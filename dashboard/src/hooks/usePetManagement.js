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

  // 2. Load Pets (Bổ sung bộ lọc mới)
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
            is_existing: true,
          })),
        }));

        // --- LOGIC LỌC CŨ (GIỮ NGUYÊN) ---
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

        // --- BỔ SUNG BỘ LỌC MỚI (SEARCH NÂNG CAO) ---

        // 1. Giới tính
        if (filters.gender) {
          mappedPets = mappedPets.filter((p) => p.gender === filters.gender);
        }

        // 2. Khoảng giá (Min - Max Price)
        if (filters.minPrice) {
          mappedPets = mappedPets.filter(
            (p) => p.price >= Number(filters.minPrice)
          );
        }
        if (filters.maxPrice) {
          mappedPets = mappedPets.filter(
            (p) => p.price <= Number(filters.maxPrice)
          );
        }

        // 3. Độ tuổi (Min - Max Age)
        if (filters.minAge) {
          mappedPets = mappedPets.filter(
            (p) => p.age >= Number(filters.minAge)
          );
        }
        if (filters.maxAge) {
          mappedPets = mappedPets.filter(
            (p) => p.age <= Number(filters.maxAge)
          );
        }

        // 4. Cân nặng (Min - Max Weight)
        if (filters.minWeight) {
          mappedPets = mappedPets.filter(
            (p) => p.weight >= Number(filters.minWeight)
          );
        }
        if (filters.maxWeight) {
          mappedPets = mappedPets.filter(
            (p) => p.weight <= Number(filters.maxWeight)
          );
        }

        // 5. Chiều cao (Min - Max Height)
        if (filters.minHeight) {
          mappedPets = mappedPets.filter(
            (p) => p.height >= Number(filters.minHeight)
          );
        }
        if (filters.maxHeight) {
          mappedPets = mappedPets.filter(
            (p) => p.height <= Number(filters.maxHeight)
          );
        }
        // ---------------------------------------------

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

  // 3. SAVE (Giữ nguyên)
  const savePet = async (petData) => {
    try {
      const formData = new FormData();
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

      const jsonBlob = new Blob([JSON.stringify(petDto)], {
        type: "application/json",
      });
      formData.append("pet", jsonBlob);

      if (petData.images && petData.images.length > 0) {
        petData.images.forEach((img) => {
          if (img.file) {
            formData.append("files", img.file);
          }
        });
      }

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

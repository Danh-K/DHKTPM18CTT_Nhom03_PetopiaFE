import { useState, useEffect, useCallback } from "react";
import petApi from "../api/petApi";
import { toast } from "react-toastify";

export const usePetManagement = () => {
  const [pets, setPets] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Load Categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await petApi.getCategories();
      const data = res.data || res;
      if (Array.isArray(data)) {
        const mappedCats = data.map((c) => ({
          category_id: c.categoryId,
          name: c.name,
        }));
        setCategories(mappedCats);
      }
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    }
  }, []);

  // Load & Filter Pets
  const fetchPets = useCallback(
    async (page = 1, searchQuery = "", filters = {}) => {
      setLoading(true);
      try {
        const res = await petApi.getAll();
        const apiData = res.data || res;
        const rawList = Array.isArray(apiData.data)
          ? apiData.data
          : apiData || [];

        // 1. Map Data
        let mappedPets = rawList.map((p) => ({
          pet_id: p.petId,
          name: p.name,
          description: p.description,
          category_id:
            p.categoryId || (p.category ? p.category.categoryId : ""),
          category_name:
            p.categoryName || (p.category ? p.category.name : "Chưa phân loại"),
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
          vaccination_history: p.vaccinationHistory, // Thêm trường này
          images: (p.images || []).map((img) => ({
            image_id: img.imageId,
            image_url: img.imageUrl,
            is_thumbnail: img.isThumbnail,
          })),
        }));

        // 2. Filter Logic
        if (searchQuery) {
          mappedPets = mappedPets.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (filters.category_id) {
          mappedPets = mappedPets.filter(
            (p) => p.category_id === filters.category_id
          );
        }
        if (filters.status) {
          mappedPets = mappedPets.filter((p) => p.status === filters.status);
        }
        if (filters.price) {
          if (filters.price === "under-5m")
            mappedPets = mappedPets.filter((p) => p.price < 5000000);
          if (filters.price === "5m-10m")
            mappedPets = mappedPets.filter(
              (p) => p.price >= 5000000 && p.price <= 10000000
            );
          if (filters.price === "over-10m")
            mappedPets = mappedPets.filter((p) => p.price > 10000000);
        }

        setTotalElements(mappedPets.length);
        setTotalPages(Math.ceil(mappedPets.length / 10));

        // 3. Pagination
        const pageSize = 10;
        const startIndex = (page - 1) * pageSize;
        const paginatedPets = mappedPets.slice(
          startIndex,
          startIndex + pageSize
        );

        setPets(paginatedPets);
      } catch (error) {
        console.error("Error fetching pets:", error);
        toast.error("Không thể tải danh sách thú cưng");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Save
  const savePet = async (petData) => {
    try {
      const payload = {
        petId: petData.pet_id,
        name: petData.name,
        description: petData.description,
        categoryId: petData.category_id,
        age: petData.age,
        gender: petData.gender,
        price: petData.price,
        discountPrice: petData.discount_price,
        stockQuantity: petData.stock_quantity,
        status: petData.status,
        weight: petData.weight,
        height: petData.height,
        color: petData.color,
        furType: petData.fur_type,
        healthStatus: petData.health_status,
        vaccinationHistory: petData.vaccination_history,
        images: (petData.images || []).map((img) => ({
          imageId: img.image_id,
          imageUrl: img.image_url,
          isThumbnail: img.is_thumbnail,
        })),
      };
      await petApi.createOrUpdate(payload);
      toast.success(
        petData.pet_id ? "Cập nhật thành công!" : "Thêm mới thành công!"
      );
      return true;
    } catch (error) {
      toast.error("Lỗi lưu dữ liệu");
      return false;
    }
  };

  // Delete
  const deletePet = async (id) => {
    try {
      await petApi.delete(id);
      toast.success("Xóa thú cưng thành công!");
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

import { useState, useEffect, useCallback } from "react";
import petApi from "../api/petApi";
import { toast } from "react-toastify";

export const usePetManagement = () => {
  const [allPets, setAllPets] = useState([]); // Lưu toàn bộ dữ liệu gốc
  const [pets, setPets] = useState([]); // Dữ liệu hiển thị (đã phân trang/lọc)
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

  // Load All Pets (Lấy 1 lần, xử lý filter/paging ở client)
  const fetchPets = useCallback(
    async (page = 1, searchQuery = "", filters = {}) => {
      setLoading(true);
      try {
        // Luôn gọi getAll để đảm bảo có ảnh
        const res = await petApi.getAll();
        const apiData = res.data || res;
        const rawList = Array.isArray(apiData.data)
          ? apiData.data
          : apiData || [];

        // 1. Mapping dữ liệu
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
          images: (p.images || []).map((img) => ({
            image_id: img.imageId,
            image_url: img.imageUrl,
            is_thumbnail: img.isThumbnail,
          })),
        }));

        // 2. Lọc (Client-side Filter)
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
          // Logic giá
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
        setTotalPages(Math.ceil(mappedPets.length / 10)); // 10 item/trang

        // 3. Phân trang (Pagination)
        const pageSize = 10;
        const startIndex = (page - 1) * pageSize;
        const paginatedPets = mappedPets.slice(
          startIndex,
          startIndex + pageSize
        );

        setAllPets(mappedPets); // Lưu lại list đã lọc
        setPets(paginatedPets); // Lưu list hiển thị
      } catch (error) {
        console.error("Error fetching pets:", error);
        toast.error("Không thể tải danh sách thú cưng");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Create / Update
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
      console.error(error);
      toast.error(
        "Lỗi lưu dữ liệu: " + (error.response?.data?.message || error.message)
      );
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
      toast.error(
        "Lỗi khi xóa: " + (error.response?.data?.message || "Có lỗi xảy ra")
      );
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

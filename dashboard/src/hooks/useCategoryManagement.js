import { useState, useEffect, useCallback } from "react";
import categoryApi from "../api/categoryApi";
import { toast } from "react-toastify";

export const useCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // --- Fetch Data ---
  const fetchCategories = useCallback(async (page = 1, keyword = "") => {
    setLoading(true);
    try {
      const params = { page: page - 1, size: 10, keyword };
      const res = await categoryApi.getAll(params);
      const apiData = res.data || {};
      const rawList = apiData.content || [];

      const mappedList = rawList.map((item) => ({
        categoryId: item.categoryId,
        name: item.name,
        description: item.description || "",
        parentId: item.parent ? item.parent.categoryId : null,
        parentName: item.parent ? item.parent.name : "---",
        imageUrl: item.imageUrl || "",
      }));

      setCategories(mappedList);
      const totalEl = apiData.totalElements || 0;
      const size = apiData.size || 10;
      setTotalElements(totalEl);
      setTotalPages(Math.ceil(totalEl / size) || 1);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Fetch All for Dropdown ---
  const fetchAllCategories = useCallback(async () => {
    try {
      const res = await categoryApi.getAll({ page: 0, size: 100 });
      const apiData = res.data || {};
      const rawList = apiData.content || [];
      setAllCategories(
        rawList.map((item) => ({
          categoryId: item.categoryId,
          name: item.name,
        }))
      );
    } catch (error) {
      console.error("Lỗi tải dropdown:", error);
    }
  }, []);

  // --- Save ---
  const saveCategory = async (categoryData, file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      const parentIdToSend =
        categoryData.parentId && categoryData.parentId !== ""
          ? categoryData.parentId
          : null;

      const categoryDto = {
        categoryId: categoryData.categoryId || null,
        name: categoryData.name,
        description: categoryData.description,
        parentId: parentIdToSend,
        imageUrl: categoryData.imageUrl || null,
      };

      const jsonBlob = new Blob([JSON.stringify(categoryDto)], {
        type: "application/json",
      });
      formData.append("category", jsonBlob);
      if (file) formData.append("image", file);

      await categoryApi.save(formData);

      // Thông báo custom
      if (categoryData.categoryId) {
        toast.success(
          `🎉 Đã cập nhật danh mục "${categoryData.name}" thành công!`
        );
      } else {
        toast.success(
          `✅ Đã thêm mới danh mục "${categoryData.name}" thành công!`
        );
      }

      await fetchCategories();
      await fetchAllCategories();
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi khi lưu dữ liệu";
      toast.error(`❌ ${msg}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- Delete (ĐÃ SỬA: Bỏ window.confirm) ---
  const deleteCategory = async (id) => {
    // Logic confirm chuyển sang UI Component
    setLoading(true);
    try {
      await categoryApi.delete(id);

      toast.success("🗑️ Đã xóa danh mục thành công!");

      await fetchAllCategories();
      return true;
    } catch (error) {
      toast.error("❌ Không thể xóa (Có thể danh mục đang chứa sản phẩm)");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAllCategories();
  }, [fetchCategories, fetchAllCategories]);

  return {
    categories,
    allCategories,
    loading,
    totalPages,
    totalElements,
    fetchCategories,
    saveCategory,
    deleteCategory,
  };
};

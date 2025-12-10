import React, { useState, useEffect } from "react";
import { useCategoryManagement } from "../../hooks/useCategoryManagement";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaImage, FaChevronLeft, FaChevronRight, FaExclamationTriangle } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryManagement = () => {
  const {
    categories,
    allCategories,
    loading,
    totalPages,
    totalElements,
    fetchCategories,
    saveCategory,
    deleteCategory,
  } = useCategoryManagement();

  // State UI
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  
  // State Modal Thêm/Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State Modal Xóa (MỚI)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: "" });

  // State Form
  const [formData, setFormData] = useState({ categoryId: "", name: "", description: "", parentId: "", imageUrl: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword) setCurrentPage(1);
      fetchCategories(currentPage, keyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword, fetchCategories]);

  useEffect(() => {
    fetchCategories(currentPage, keyword);
  }, [currentPage]);

  // --- Handlers Modal Thêm/Sửa ---
  const handleOpenModal = (category) => {
    if (category?.categoryId) {
      setFormData({ ...category, parentId: category.parentId || "", imageUrl: category.imageUrl || "" });
      setPreviewUrl(category.imageUrl || "");
    } else {
      setFormData({ categoryId: "", name: "", description: "", parentId: "", imageUrl: "" });
      setPreviewUrl("");
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveCategory(formData, selectedFile);
    if (success) {
      setIsModalOpen(false);
      fetchCategories(currentPage, keyword);
    }
  };

  // --- Handlers Modal Xóa (MỚI) ---
  const openDeleteConfirmation = (cat) => {
    setDeleteModal({ isOpen: true, id: cat.categoryId, name: cat.name });
  };

  const confirmDelete = async () => {
    if (deleteModal.id) {
      const success = await deleteCategory(deleteModal.id);
      if (success) {
        setDeleteModal({ isOpen: false, id: null, name: "" });
        fetchCategories(currentPage, keyword);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h1>
            <p className="text-gray-500 text-sm mt-1">Tổng số: <span className="font-semibold text-blue-600">{totalElements}</span> danh mục</p>
          </div>
          <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md font-medium">
            <FaPlus /> Thêm mới
          </button>
        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[400px]">
          {loading ? (
             <div className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Đang tải dữ liệu...</p>
             </div>
          ) : (
            <>
            <div className="overflow-x-auto flex-1">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Hình ảnh</th>
                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Tên danh mục</th>
                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Danh mục cha</th>
                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Mô tả</th>
                    <th className="p-4 text-center text-xs font-bold text-gray-500 uppercase">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((cat) => (
                      <tr key={cat.categoryId || Math.random()} className="hover:bg-blue-50 transition-colors">
                        <td className="p-4">
                          <div className="w-12 h-12 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
                            {cat.imageUrl ? (
                              <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                              <FaImage className="text-gray-300" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                            <div className="text-sm font-semibold text-gray-800">{cat.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{cat.categoryId}</div>
                        </td>
                        <td className="p-4 text-sm">
                            {cat.parentName && cat.parentName !== "---" ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{cat.parentName}</span>
                            ) : <span className="text-gray-400 text-sm">---</span>}
                        </td>
                        <td className="p-4 text-gray-500 text-sm max-w-xs truncate">{cat.description}</td>
                        <td className="p-4">
                          <div className="flex justify-center gap-3">
                            <button onClick={() => handleOpenModal(cat)} className="text-blue-600 hover:text-blue-800 transition transform hover:scale-110" title="Chỉnh sửa">
                              <FaEdit size={18} />
                            </button>
                            {/* Gọi hàm mở modal xóa custom */}
                            <button onClick={() => openDeleteConfirmation(cat)} className="text-red-600 hover:text-red-800 transition transform hover:scale-110" title="Xóa">
                              <FaTrash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-gray-500"><p>Không tìm thấy dữ liệu</p></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-500">Trang <span className="font-semibold text-gray-800">{currentPage}</span> / <span className="font-semibold text-gray-800">{totalPages}</span></div>
                <div className="flex gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100 border"}`}>
                        <FaChevronLeft size={12} /> Trước
                    </button>
                    <div className="hidden sm:flex gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                           <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-700 border hover:bg-gray-50"}`}>
                               {i + 1}
                           </button>
                        ))}
                    </div>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100 border"}`}>
                        Sau <FaChevronRight size={12} />
                    </button>
                </div>
            </div>
            </>
          )}
        </div>
      </div>

      {/* --- MODAL THÊM / SỬA --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
               <h2 className="text-lg font-bold text-gray-800">{formData.categoryId ? "Cập nhật Danh mục" : "Thêm Danh mục Mới"}</h2>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Form Fields (Giữ nguyên như cũ) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên danh mục <span className="text-red-500">*</span></label>
                <input type="text" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                <textarea className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục cha</label>
                <div className="relative">
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none" value={formData.parentId} onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}>
                        <option value="">-- Danh mục gốc --</option>
                        {allCategories && allCategories.filter(c => c.categoryId !== formData.categoryId).map(c => (<option key={c.categoryId} value={c.categoryId}>{c.name}</option>))}
                    </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
                <div className="flex items-start gap-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <div className="w-24 h-24 border rounded-lg bg-white flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                    {previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" /> : <FaImage className="text-gray-300 text-3xl" />}
                  </div>
                  <div className="flex-1">
                    <input type="file" id="file-upload" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="file-upload" className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 text-sm font-medium text-gray-700 shadow-sm">Chọn ảnh</label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Hủy bỏ</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 font-medium shadow-md">
                  {loading ? "Đang lưu..." : (formData.categoryId ? "Lưu thay đổi" : "Tạo mới")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL XÓA (CUSTOM UI) --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-up">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaExclamationTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Xác nhận xóa?</h3>
                    <p className="text-gray-600 mb-6">
                        Bạn có chắc chắn muốn xóa danh mục <span className="font-bold text-gray-800">"{deleteModal.name}"</span> không? 
                        <br/><span className="text-xs text-red-500">Hành động này không thể hoàn tác.</span>
                    </p>
                    
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={() => setDeleteModal({ isOpen: false, id: null, name: "" })}
                            className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            onClick={confirmDelete}
                            disabled={loading}
                            className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium shadow-md transition-colors flex items-center gap-2"
                        >
                            {loading ? "Đang xóa..." : "Xóa ngay"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default CategoryManagement;
import { HiSearch, HiX } from "react-icons/hi";

export default function PromotionFilters({
  darkMode,
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  categories,
}) {

  const isSearching = searchTerm.trim().length > 0 || categoryFilter !== "all" || statusFilter !== "all" || typeFilter !== "all";

  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <HiSearch className="absolute left-3 top-6 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            autoFocus
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-6 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <HiX className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-green-500`}
        >
          <option value="all">Danh mục</option>
          {categories.map((c) => (
            <option key={c.id || "null"} value={c.id || "null"}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-green-500`}
        >
          <option value="all">Trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="expired">Hết hạn</option>
          <option value="inactive">Không hoạt động</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-green-500`}
        >
          <option value="all">Loại</option>
          <option value="discount">Phần trăm / Cố định</option>
          <option value="freeship">Miễn phí vận chuyển</option>
          <option value="cashback">Hoàn tiền</option>
          <option value="bundle">Gói</option>
        </select>

      </div>

      {isSearching && (
  <div className="mt-4 -mb-2 text-sm animate-fadeIn flex flex-wrap items-center gap-2">
    <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
      Đang tìm kiếm theo:
    </span>

    <div className="flex flex-wrap gap-2">
      {/* Từ khóa */}
      {searchTerm.trim() && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 font-medium text-xs">
          <HiSearch className="w-3.5 h-3.5" />
          Từ khóa: "{searchTerm.trim()}"
        </span>
      )}

      {/* Danh mục */}
      {categoryFilter !== "all" && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 font-medium text-xs">
          Danh mục: {categories.find(c => c.id === categoryFilter)?.name || categoryFilter}
        </span>
      )}

      {/* Trạng thái */}
      {statusFilter !== "all" && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 font-medium text-xs">
          Trạng thái: {
            statusFilter === "active" ? "Đang hoạt động" :
            statusFilter === "inactive" ? "Tạm dừng" :
            statusFilter === "expired" ? "Hết hạn" : statusFilter
          }
        </span>
      )}

      {/* Loại khuyến mãi */}
      {typeFilter !== "all" && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-medium text-xs">
          Loại: {
            typeFilter === "discount" ? "Giảm giá" :
            typeFilter === "freeship" ? "Miễn phí vận chuyển" :
            typeFilter === "cashback" ? "Hoàn tiền" :
            typeFilter === "bundle" ? "Gói sản phẩm" : typeFilter
          }
        </span>
      )}
    </div>
  </div>
)}
    </div>
  );
}
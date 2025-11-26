import { HiSearch } from "react-icons/hi";

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
  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
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

        <select className={`w-full px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"} focus:outline-none focus:ring-2 focus:ring-green-500`}>
          <option>Sắp xếp</option>
          <option>Mới nhất</option>
          <option>Cũ nhất</option>
          <option>Tên A-Z</option>
        </select>
      </div>
    </div>
  );
}
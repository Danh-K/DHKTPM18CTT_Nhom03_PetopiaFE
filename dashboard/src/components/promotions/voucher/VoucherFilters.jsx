import { HiSearch, HiX } from "react-icons/hi";

export default function VoucherFilters({ darkMode, searchTerm, setSearchTerm, statusFilter, setStatusFilter, typeFilter, setTypeFilter }) {
  const isSearching = searchTerm || statusFilter !== "all" || typeFilter !== "all";

  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm mã hoặc mô tả..."
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"} focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <HiX className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"} focus:outline-none focus:ring-2 focus:ring-[#7b4f35]`}>
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
          <option value="expired">Hết hạn</option>
        </select>

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={`px-4 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"} focus:outline-none focus:ring-2 focus:ring-[#7b4f35]`}>
          <option value="all">Tất cả loại</option>
          <option value="percentage">Phần trăm</option>
          <option value="fixed">Cố định</option>
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

            {/* Loại giảm giá */}
            {typeFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-medium text-xs">
                Loại: {
                    typeFilter === "percentage" ? "Phần trăm" :
                    typeFilter === "fixed" ? "Cố định" : typeFilter
                }
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
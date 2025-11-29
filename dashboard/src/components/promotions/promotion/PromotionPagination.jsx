import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function PromotionPagination({
  currentPage,
  totalPages,
  setCurrentPage,
  totalItems = 0,
}) {
  const itemsPerPage = 9;
  const startIndex = (currentPage - 1) * itemsPerPage;

  if (totalPages <= 1) return null; // ẩn nếu chỉ có 1 trang

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          Hiển thị {startIndex + 1} -{" "}
          {Math.min(startIndex + itemsPerPage, totalItems)} trong tổng{" "}
          {totalItems} mục
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 flex rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
             <HiChevronLeft className="w-5 h-5" /> Trước
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors text-sm ${
                  currentPage === i + 1
                    ? "bg-[#7b4f35] text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 flex rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Tiếp <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

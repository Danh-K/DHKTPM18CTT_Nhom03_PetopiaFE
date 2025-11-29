import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

export default function PaginationControls({ currentPage, totalPages, totalElements, size, onPageChange }) {
  if (!totalElements || totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 6

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      let start = currentPage - 2
      let end = currentPage + 2

      if (start < 1) { start = 1; end = maxPagesToShow }
      if (end > totalPages) { end = totalPages; start = totalPages - maxPagesToShow + 1 }

      if (start > 1) {
        pages.push(1)
        if (start > 2) pages.push("...")
      }
      for (let i = start; i <= end; i++) pages.push(i)
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...")
        pages.push(totalPages)
      }
    }
    return pages
  }

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Hiển thị <span className="font-medium">{(currentPage - 1) * size + 1}</span> đến{" "}
          <span className="font-medium">{Math.min(currentPage * size, totalElements)}</span> trong{" "}
          <span className="font-medium">{totalElements}</span> kết quả
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
          >
            <FaChevronLeft className="text-sm" /> Trước
          </button>

          <div className="flex gap-1">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={index} className="px-4 py-2 text-gray-500">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
          >
            Sau <FaChevronRight className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  )
}
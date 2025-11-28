export default function VoucherPagination({ currentPage, totalPages, totalItems, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          Hiển thị {(currentPage - 1) * 9 + 1} - {Math.min(currentPage * 9, totalItems)} trong {totalItems} mục
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium">
            Trước
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i + 1} onClick={() => onPageChange(i + 1)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors text-sm ${currentPage === i + 1 ? "bg-[#7b4f35] text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium">
            Tiếp
          </button>
        </div>
      </div>
    </div>
  );
}
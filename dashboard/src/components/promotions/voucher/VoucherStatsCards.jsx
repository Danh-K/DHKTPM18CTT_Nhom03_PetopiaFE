import { HiTicket, HiTrendingUp, HiClock } from "react-icons/hi";

export default function VoucherStatsCards({ darkMode, active, total, remainingUses }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg text-gray-500 mb-1">Voucher Hoạt động</p>
            <p className="text-3xl font-bold text-green-600">{active}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <HiTrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg text-gray-500 mb-1">Tổng Voucher</p>
            <p className="text-3xl font-bold text-blue-600">{total}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <HiTicket className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className={`rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white shadow-md"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg text-gray-500 mb-1">Lượt dùng còn lại</p>
            <p className="text-3xl font-bold text-emerald-600">{remainingUses.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <HiClock className="w-7 h-7 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
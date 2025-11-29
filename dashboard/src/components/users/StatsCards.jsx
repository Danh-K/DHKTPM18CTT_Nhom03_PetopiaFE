import { FaUser } from "react-icons/fa"
import { HiUserCircle } from "react-icons/hi"

export default function StatsCards({ users, totalElements }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Tổng người dùng</p>
            <p className="text-3xl font-bold text-blue-500">{totalElements}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
            <FaUser className="text-white text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Người dùng hoạt động (Trong trang)</p>
            <p className="text-3xl font-bold text-green-600">{users.filter((u) => u.isActive).length}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
            <HiUserCircle className="text-white text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Quản trị viên (Trong trang)</p>
            <p className="text-3xl font-bold text-purple-600">{users.filter((u) => u.role === "ADMIN").length}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
            <FaUser className="text-white text-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
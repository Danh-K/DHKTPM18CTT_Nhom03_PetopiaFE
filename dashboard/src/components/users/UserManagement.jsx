"use client"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaSearch, FaEdit, FaEllipsisV, FaChevronLeft, FaChevronRight, FaSpinner, FaUser } from "react-icons/fa"
import { fetchUsers, searchUsers } from "../../store/userSlice"
import EditUserForm from "./EditUserForm"
import { setCurrentPage } from "../../store/userSlice"
import { HiUserCircle } from "react-icons/hi"

const AllUsers = () => {
  const dispatch = useDispatch()
  const { list: users, totalElements, currentPage, size, loading, error, isSearching } = useSelector((state) => state.user)

  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [openDropdown, setOpenDropdown] = useState(null)

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage - 1, size }))
  }, [dispatch, currentPage, size])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm || filterRole !== "All" || filterStatus !== "All") {
        const filters = {
          keyword: searchTerm,
          role: filterRole !== "All" ? filterRole : undefined,
          isActive: filterStatus !== "All" ? filterStatus === "ACTIVE" ? true : false : undefined,
          page: 0,
          size,
        }
        dispatch(searchUsers(filters))
      } else if (isSearching) {
        dispatch(fetchUsers({ page: 0, size }))
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, filterRole, filterStatus, dispatch, size, isSearching])

  const handleEdit = (user) => {
    setSelectedUser(user)
    setShowEditModal(true)
    setOpenDropdown(null)
  }

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    dispatch(setCurrentPage(pageNumber));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalElements / size)
  const getStatusColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800"
      case "CUSTOMER":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (name.length <= 2) return "***@" + domain;
    return name.slice(0, 3) + "****@" + domain;
  }

  const maskPhone = (phone) => {
    if (!phone) return "";
    return phone.slice(0, 3) + "*****" + phone.slice(-2);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#7b4f35]">Quản lý người dùng</h1>
          <p className="text-[#7b4f35] mt-1">Quản lý tất cả người dùng trong hệ thống</p>
        </div>

        {/* Stats */}
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

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="All">Vai trò</option>
                <option value="ADMIN">ADMIN</option>
                <option value="CUSTOMER">CUSTOMER</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="All">Trạng thái</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Số điện thoại
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading && !users.length ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <FaSpinner className="animate-spin text-blue-500 text-xl" />
                        <span className="text-gray-600">Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <p className="text-gray-500 text-lg">Không tìm thấy người dùng</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.userId}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.fullName || user.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-md">
                              {user.fullName?.charAt(0) || user.username?.charAt(0)}
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.fullName || user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{maskEmail(user.email)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{maskPhone(user.phoneNumber)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.isActive)}`}
                        >
                          {user.isActive ? "Hoạt động" : "Không hoạt động"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === user.userId ? null : user.userId)}
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                          >
                            <FaEllipsisV />
                          </button>
                          {openDropdown === user.userId && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10 animate-slideDown">
                              <button
                                onClick={() => handleEdit(user)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-300 flex items-center gap-2 rounded-t-lg rounded-b-lg"
                              >
                                <FaEdit className="text-blue-600" /> Chỉnh sửa
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {users.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{(currentPage - 1) * size + 1}</span> đến{" "}
                  <span className="font-medium">{Math.min(currentPage * size, totalElements)}</span> trong{" "}
                  <span className="font-medium">{totalElements}</span> kết quả
                </div>

                <div className="flex items-center gap-2">
                  {/* Nút Trước */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                    }`}
                  >
                    <FaChevronLeft className="text-sm" />
                    Trước
                  </button>

                  {/* Các nút số trang - ĐÃ SỬA THEO YÊU CẦU CỦA BẠN */}
                  <div className="flex gap-1">
                    {(() => {
                      const pages = [];
                      const maxPagesToShow = 6;  // luôn hiển thị tối đa 6 số

                      if (totalPages <= maxPagesToShow) {
                        // Nếu ít hơn hoặc bằng 6 trang → hiện hết
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        // Luôn hiện 3 trang gần currentPage
                        let start = currentPage - 2;
                        let end = currentPage + 2;

                        if (start < 1) {
                          start = 1;
                          end = maxPagesToShow;
                        }
                        if (end > totalPages) {
                          end = totalPages;
                          start = totalPages - maxPagesToShow + 1;
                        }

                        // Thêm trang đầu nếu không nằm trong khoảng
                        if (start > 1) {
                          pages.push(1);
                          if (start > 2) pages.push("...");
                        }

                        // Thêm các trang ở giữa
                        for (let i = start; i <= end; i++) {
                          pages.push(i);
                        }

                        // Thêm trang cuối nếu cần
                        if (end < totalPages) {
                          if (end < totalPages - 1) pages.push("...");
                          pages.push(totalPages);
                        }
                      }

                      return pages.map((page, index) => {
                        if (page === "...") {
                          return (
                            <span key={index} className="px-4 py-2 text-gray-500">
                              ...
                            </span>
                          );
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                              currentPage === page
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  {/* Nút Tiếp theo */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                    }`}
                  >
                    Sau
                    <FaChevronRight className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditUserForm show={showEditModal} onClose={() => setShowEditModal(false)} user={selectedUser} />

    </div>
  )
}

export default AllUsers

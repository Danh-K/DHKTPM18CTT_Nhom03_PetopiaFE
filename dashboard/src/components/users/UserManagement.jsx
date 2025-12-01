"use client"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers, searchUsers, updateUser, setCurrentPage } from "../../store/userSlice"
import EditUserForm from "./EditUserForm"

import StatsCards from "./StatsCards"
import SearchFilterBar from "./SearchFilterBar"
import PaginationControls from "./PaginationControls"
import ConfirmLockModal from "./ConfirmLockModal"

import { FaEllipsisV, FaEdit } from "react-icons/fa"
import { FaLock, FaUnlock } from "react-icons/fa6"
import { FaSpinner } from "react-icons/fa"

const maskEmail = (email) => email ? email.split("@")[0].slice(0, 3) + "****@" + email.split("@")[1] : ""
const maskPhone = (phone) => phone ? phone.slice(0, 3) + "*****" + phone.slice(-2) : ""

const getRoleColor = (role) => role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
const getStatusColor = (active) => active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"

export default function AllUsers() {
  const dispatch = useDispatch()
  const { list: users, totalElements, currentPage, size, loading, error, isSearching } = useSelector(s => s.user)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [openDropdown, setOpenDropdown] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [confirmModal, setConfirmModal] = useState({ show: false, user: null, action: "lock" })

  const totalPages = Math.ceil(totalElements / size)

  useEffect(() => { dispatch(fetchUsers({ page: currentPage - 1, size })) }, [currentPage, size])
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchTerm || filterRole !== "All" || filterStatus !== "All") {
        dispatch(searchUsers({
          keyword: searchTerm,
          role: filterRole !== "All" ? filterRole : undefined,
          isActive: filterStatus !== "All" ? filterStatus === "ACTIVE" : undefined,
          page: 0, size
        }))
      }
      else if (isSearching) {
        dispatch(setCurrentPage(1))
        dispatch(fetchUsers({ page: 0, size }))
      }
    }, 500)
    return () => clearTimeout(t)
  }, [searchTerm, filterRole, filterStatus, dispatch, size, isSearching])

  const handleEdit = (user) => { setSelectedUser(user); setShowEditModal(true); setOpenDropdown(null) }
  const handleToggleLock = (user) => {
    if (user.role === "ADMIN") return setOpenDropdown(null)
    setConfirmModal({ show: true, user, action: user.isActive ? "lock" : "unlock" })
  }
  const executeLockToggle = async () => {
    await dispatch(updateUser({ userId: confirmModal.user.userId, userData: { isActive: !confirmModal.user.isActive } })).unwrap()
    dispatch(fetchUsers({ page: currentPage - 1, size }))
    setConfirmModal({ show: false, user: null })
  }
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    dispatch(setCurrentPage(page))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#7b4f35]">Quản lý người dùng</h1>
          <p className="text-[#7b4f35] mt-1">Quản lý tất cả người dùng trong hệ thống</p>
        </div>

        <StatsCards users={users} totalElements={totalElements} />
        <SearchFilterBar {...{ searchTerm, setSearchTerm, filterRole, setFilterRole, filterStatus, setFilterStatus }} />

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-700 font-medium">{error}</p></div>}

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Họ tên</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Địa chỉ</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading && !users.length ? (
                  <tr><td colSpan="7" className="px-6 py-12 text-center"><div className="flex justify-center items-center gap-2"><FaSpinner className="animate-spin text-blue-500 text-xl" /><span className="text-gray-600">Đang tải dữ liệu...</span></div></td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500 text-lg">Không tìm thấy người dùng</td></tr>
                ) : users.map(user => (
                  <tr key={user.userId} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" /> :
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-md">
                            {user.fullName?.[0] || user.username?.[0]}
                          </div>}
                        <div className="ml-4 text-sm font-medium text-gray-900">{user.fullName || user.username}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{maskEmail(user.email)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{maskPhone(user.phoneNumber)}</td>
                    <td className="px-6 py-4 text-left text-sm text-gray-700 max-w-xs">
                      {user.addresses?.length > 0 ? user.addresses.map((a, i) => (
                        <div key={i} className={`text-xs ${a.isDefault ? "font-medium text-blue-700" : "text-gray-600"}`}>
                          {a.street}, {a.ward}, {a.district}, {a.province}
                        </div>
                      )) : <span className="text-gray-400 italic text-xs">Chưa có địa chỉ</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.isActive)}`}>
                        {user.isActive ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="relative inline-block">
                        <button onClick={() => setOpenDropdown(openDropdown === user.userId ? null : user.userId)} className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
                          <FaEllipsisV />
                        </button>
                        {openDropdown === user.userId && (
                          <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                            <button onClick={() => { handleEdit(user); setOpenDropdown(null) }} className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition">
                              <FaEdit className="text-blue-600" /> Chỉnh sửa
                            </button>
                            {user.role !== "ADMIN" && (
                              <button onClick={() => { handleToggleLock(user); setOpenDropdown(null) }} className={`w-full text-left px-2 py-2 text-sm flex items-center gap-3 transition-all ${user.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}>
                                {user.isActive ? <><FaLock className="text-red-600" /> Khóa tài khoản</> : <><FaUnlock className="text-green-600" /> Mở khóa tài khoản</>}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            size={size}
            onPageChange={handlePageChange}
          />
        </div>

        <ConfirmLockModal
          show={confirmModal.show}
          onClose={() => setConfirmModal({ show: false, user: null, action: "lock" })}
          onConfirm={executeLockToggle}
          user={confirmModal.user}
          action={confirmModal.action}
        />

        <EditUserForm show={showEditModal} onClose={() => setShowEditModal(false)} user={selectedUser} />
      </div>
    </div>
  )
}
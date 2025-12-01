"use client"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers, updateUser } from "../../store/userSlice"
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaToggleOn, FaToggleOff } from "react-icons/fa"

const EditUserForm = ({ show, onClose, user }) => {
  const dispatch = useDispatch()
  const { currentPage, size } = useSelector(state => state.user)
  const currentLoggedInUser = useSelector(state => state.auth.user)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    isActive: true,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && show) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        isActive: user.userId === currentLoggedInUser?.userId ? true : formData.isActive
      })
    }
  }, [user, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleActive = () => {
    if (user?.role === "ADMIN") {
      return;
    }
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user?.userId) return

    setLoading(true)
    try {
      await dispatch(
        updateUser({
          userId: user.userId,
          userData: {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            isActive: formData.isActive,
          },
        })
      ).unwrap()

      dispatch(fetchUsers({ page: currentPage - 1, size }))

      onClose()
    } catch (err) {
      console.error("Cập nhật thất bại:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null
  const isEditingSelf = user?.userId === currentLoggedInUser?.userId

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FaUser className="text-blue-600" />
            Chỉnh sửa người dùng
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Họ tên */}
          <>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaUser className="text-gray-500" />
              Họ và tên
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Nguyễn Văn A"
            />
          </>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaEnvelope className="text-gray-500" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="example@gmail.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaPhone className="text-gray-500" />
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="0901234567"
            />
          </div>

          {/* Trạng thái */}
          {user?.role !== "ADMIN" && !isEditingSelf && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Trạng thái tài khoản
              </label>
              <button type="button" onClick={handleToggleActive}
                className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium
                  ${formData.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {formData.isActive ? <FaToggleOn className="text-2xl text-green-600" /> : <FaToggleOff className="text-2xl text-red-600" />}
                <span>{formData.isActive ? "Đang hoạt động" : "Đã khóa"}</span>
              </button>
            </div>
          )}

          {/* Nếu là chính mình → hiện thông báo*/}
          {isEditingSelf && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <strong className="text-red-500">Thông báo:</strong> Bạn đang chỉnh sửa tài khoản của chính mình. Không thể khóa tài khoản này.
            </div>
          )}

          {/* Nếu đang edit Admin khác → thông báo không thể khóa */}
          {user?.role === "ADMIN" && !isEditingSelf && (
            <div className="bg-purple-50 border border-purple-300 rounded-xl p-4 text-sm text-purple-800">
              <strong>Quyền Admin:</strong> Không thể khóa tài khoản quản trị viên.
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg disabled:opacity-60 transition"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserForm
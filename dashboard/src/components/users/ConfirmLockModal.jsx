import { FaLock, FaUnlock } from "react-icons/fa6"

export default function ConfirmLockModal({ show, onClose, onConfirm, user, action }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            action === "lock" ? "bg-red-100" : "bg-green-100"
          }`}>
            {action === "lock" ? (
              <FaLock className="w-8 h-8 text-red-600" />
            ) : (
              <FaUnlock className="w-8 h-8 text-green-600" />
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {action === "lock" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Bạn có chắc chắn muốn{" "}
            <span className="font-semibold text-gray-900">
              {action === "lock" ? "KHÓA" : "MỞ KHÓA"}
            </span>{" "}
            tài khoản của người dùng{" "}
            <span className="font-semibold text-gray-900">
              {user?.fullName || user?.username}
            </span>?
          </p>
        </div>

        <div className="flex border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-gray-700 hover:bg-gray-50 font-medium transition"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 font-bold transition ${
              action === "lock"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {action === "lock" ? "Khóa ngay" : "Mở khóa ngay"}
          </button>
        </div>
      </div>
    </div>
  )
}
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineHeart,
  HiOutlineShieldCheck,
} from "react-icons/hi";

export default function LoginPage({ onLoginSuccess, onForgotPasswordClick }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPass = localStorage.getItem("rememberedPassword");
    if (savedEmail) {
      setEmail(savedEmail);
      setPassword(savedPass || "");
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ email/username và mật khẩu");
      return;
    }
    setError("");
    const result = await dispatch(
      loginUser({ identifier: email.trim(), password })
    );
    if (loginUser.fulfilled.match(result)) {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email.trim());
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }
      onLoginSuccess?.();
    } else {
      setError(result.payload || "Thông tin đăng nhập không đúng");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:block text-amber-900">
          <div className="space-y-12">
            <div className="relative group">
              <div className="absolute -inset-8 bg-gradient-to-r from-amber-400/30 to-orange-500/30 rounded-3xl blur-3xl opacity-60 animate-pulse"></div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-300/50">
                <img
                  src="https://res.cloudinary.com/dwzjxsdli/image/upload/v1764065005/happy-cute-puppies-and-kittens-playing-together-co_suay1c.jpg"
                  alt="Petopia Admin"
                  className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/40">
                      <HiOutlineShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-sm font-medium text-amber-200 tracking-wider uppercase">
                      Admin Portal
                    </span>
                  </div>

                  <h1 className="text-6xl font-black text-white tracking-tight">
                    Petopia
                  </h1>
                  <p className="text-2xl text-amber-100 font-medium mt-2">
                    Hệ thống quản trị toàn diện
                  </p>
                </div>
              </div>
            </div>

            {/* Phần chào mừng – chuyên nghiệp hơn */}
            <div className="text-center space-y-8">
              <h2 className="text-5xl font-bold leading-tight">
                Chào mừng <span className="text-orange-600">Quản trị viên</span>
              </h2>
              <p className="text-xl text-amber-800 max-w-md mx-auto leading-relaxed">
                Bạn đang truy cập khu vực quản trị của Petopia – nơi mọi thứ
                được kiểm soát.
              </p>

              {/* 3 ô – PHIÊN BẢN CUỐI: NGẮN GỌN, CHUYÊN NGHIỆP, RẤT “ADMIN” */}
              <div className="flex justify-center gap-12 pt-8">
                {/* <div className="group text-center">
                  <div className="relative mb-5">
                    <div className="absolute inset-0 bg-amber-400/20 rounded-3xl blur-xl scale-110 group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl border border-amber-300/40 transform group-hover:scale-110 transition-all duration-300">
                      <HiOutlineShieldCheck className="w-14 h-14 text-white" />
                    </div>
                  </div>
                  <p className="font-bold text-amber-900 text-lg">Bảo mật</p>
                </div> */}

                {/* Quyền hạn */}
                <div className="group text-center">
                  <div className="relative mb-5">
                    <div className="absolute inset-0 bg-orange-400/20 rounded-3xl blur-xl scale-110 group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-orange-600 to-amber-700 rounded-3xl flex items-center justify-center shadow-2xl border border-orange-300/40 transform group-hover:scale-110 transition-all duration-300">
                      <HiOutlineLockClosed className="w-14 h-14 text-white" />
                    </div>
                  </div>
                  <p className="font-bold text-amber-900 text-lg">Toàn quyền</p>
                </div>

                {/* Ổn định */}
                <div className="group text-center">
                  <div className="relative mb-5">
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-3xl blur-xl scale-110 group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-3xl flex items-center justify-center shadow-2xl border border-yellow-300/40 transform group-hover:scale-110 transition-all duration-300">
                      <span className="text-3xl font-black text-white">
                        24/7
                      </span>
                    </div>
                  </div>
                  <p className="font-bold text-amber-900 text-lg">Liên tục</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-amber-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-amber-900">
                Đăng nhập tài khoản
              </h1>
              <p className="text-amber-700 mt-2">
                Chào mừng bạn quay lại Petopia!
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-xl text-sm font-medium text-center animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Email hoặc Username
                </label>
                <div className="relative">
                  <HiOutlineMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com hoặc username"
                    disabled={loading}
                    className="w-full pl-14 pr-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition placeholder:text-gray-800 placeholder:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <HiOutlineLockClosed
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400"
                    size={20}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                    disabled={loading}
                    className="w-full pl-14 pr-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition placeholder:text-gray-800 placeholder:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-amber-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                    disabled={loading}
                  />
                  <span className="ml-2">Ghi nhớ đăng nhập</span>
                </label>
                <button
                  type="button"
                  onClick={onForgotPasswordClick}
                  className="text-amber-600 hover:text-amber-700 font-medium transition"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-700 to-orange-600 text-white font-bold py-4 rounded-full hover:from-amber-800 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            {/* Bạn đã bỏ đăng ký → để trống hoặc thêm hỗ trợ */}
            <div className="text-center mt-8 text-sm text-amber-700">
              Cần hỗ trợ? Liên hệ admin@petopia.vn
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

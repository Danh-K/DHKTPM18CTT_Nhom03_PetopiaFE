"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

export default function LoginPage({ onLoginSuccess, onRegisterClick, onForgotPasswordClick }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // Load thông tin ghi nhớ
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
    const result = await dispatch(loginUser({ identifier: email.trim(), password }));
    if (loginUser.fulfilled.match(result)) {
      // Lưu ghi nhớ
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email.trim());
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }
      onLoginSuccess?.();
    } else {
      setError("Thông tin đăng nhập không đúng");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900">Đăng nhập tài khoản</h1>
          <p className="text-amber-700 mt-2">Chào mừng bạn quay lại Petopia!</p>
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
                    className=" w-full pl-14 pr-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition placeholder:text-gray-800 placeholder:opacity-50"
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
                    className="w-full pl-14 pr-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition placeholder:text-gray-800 placeholder:opacity-50"
                    disabled={loading}
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
            className="w-full bg-gradient-to-r from-amber-700 to-amber-600 text-white font-bold py-4 rounded-full hover:from-amber-800 hover:to-amber-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="text-center mt-8 text-sm text-amber-800">
          Cần trợ giúp?{" "}
          <button
            onClick={onRegisterClick}
            className="font-bold text-amber-600 hover:text-amber-700 underline transition"
          >
            Liên hệ hỗ trợ
          </button>
        </div>
      </div>
    </div>
  );
}
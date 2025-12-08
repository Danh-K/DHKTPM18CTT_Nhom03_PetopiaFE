"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, setLoginSuccess } from "../store/authSlice";
import { sendOtp, checkOtp } from "../store/forgotPasswordSlice";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import ForgotPasswordPage from "./ForgotPasswordPage";

export default function LoginPage({ onLoginSuccess }) {
  const dispatch = useDispatch();

  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: otpSending } = useSelector((state) => state.forgot); // khi gửi OTP
  const { loading: otpVerifying, error: otpError } = useSelector(
    (state) => state.forgot
  ); // khi xác minh OTP

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [forgotForm, setForgotForm] = useState(false);

  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [loginTempData, setLoginTempData] = useState(null); // Lưu tạm user

  const [isSendingOtp, setIsSendingOtp] = useState(false);

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
    if (!email.trim()) {
      setError("Vui lòng nhập email đăng nhập");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Email không hợp lệ. Vui lòng nhập đúng định dạng email!");
      return;
    }
    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }
    setError("");
    setIsSendingOtp(true);

    try {
      const result = await dispatch(
        loginUser({ identifier: email.trim(), password })
      );

      if (loginUser.fulfilled.match(result)) {
        setLoginTempData(result.payload);
        await dispatch(sendOtp(email.trim()));
        setShowOtpForm(true);
      } else {
        setError(result.payload || "Email hoặc mật khẩu không đúng");
      }
    } finally {
      setIsSendingOtp(false); // LUÔN bật lại nút dù thành công hay lỗi
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("Mã OTP phải là 6 chữ số");
      return;
    }

    const result = await dispatch(checkOtp({ email: email.trim(), otp }));

    if (checkOtp.fulfilled.match(result)) {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email.trim());
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      dispatch(
        setLoginSuccess({
          user: loginTempData.user,
          accessToken: loginTempData.accessToken, // Sửa key cho khớp DTO backend
          refreshToken: loginTempData.refreshToken, // Lưu cái này
        })
      );

      onLoginSuccess?.();
    } else {
      setError("Mã OTP không đúng hoặc đã hết hạn. Vui lòng kiểm tra lại!");
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const onForgotPasswordClick = () => setForgotForm(true);

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
                  className="w-full h-96 object-cover transition-transform duration-700 group85:hover:scale-105"
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

            <div className="text-center space-y-8">
              <h2 className="text-5xl font-bold leading-tight">
                Chào mừng <span className="text-orange-600">Quản trị viên</span>
              </h2>
              <div className="flex justify-center gap-12 pt-8">
                <div className="group text-center">
                  <div className="relative mb-5">
                    <div className="absolute inset-0 bg-orange-400/20 rounded-3xl blur-xl scale-110 group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-orange-600 to-amber-700 rounded-3xl flex items-center justify-center shadow-2xl border border-orange-300/40 transform group-hover:scale-110 transition-all duration-300">
                      <HiOutlineLockClosed className="w-14 h-14 text-white" />
                    </div>
                  </div>
                  <p className="font-bold text-amber-900 text-lg">Toàn quyền</p>
                </div>
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

        {forgotForm ? (
          <ForgotPasswordPage onBackToLogin={() => setForgotForm(false)} />
        ) : (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-amber-100">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-amber-900">
                  {showOtpForm ? "Xác minh OTP" : "Đăng nhập tài khoản"}
                </h1>
                <p className="text-amber-700 mt-2">
                  {showOtpForm
                    ? `Mã OTP đã gửi tới ${email}`
                    : "Chào mừng bạn quay lại Petopia!"}
                </p>
              </div>

              {/* Thông báo lỗi */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-xl text-center text-sm font-medium animate-pulse">
                  {error}
                </div>
              )}

              {/* FORM CHÍNH */}
              {showOtpForm ? (
                // FORM OTP
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="text-center">
                    <HiOutlineShieldCheck className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <input
                      type="text"
                      maxLength="6"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Mã 6 số"
                      autoFocus
                      className="w-full text-center text-4xl font-bold tracking-widest py-5 border-2 border-amber-300 rounded-2xl focus:outline-none focus:border-amber-600 transition"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtpForm(false);
                        setOtp("");
                        setError("");
                      }}
                      className="flex-1 py-3 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-50 transition"
                    >
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      disabled={otpVerifying || otp.length !== 6}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-full hover:from-green-700 hover:to-emerald-700 disabled:opacity-70 transition shadow-lg cursor-pointer"
                    >
                      {otpVerifying ? "Đang xác minh OTP..." : "Xác minh OTP"}
                    </button>
                  </div>
                </form>
              ) : (
                // FORM EMAIL + PASS
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-amber-900 mb-2">
                      Email <span className="text-red-600">*</span>
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
                        placeholder="name@example.com"
                        disabled={authLoading}
                        className="w-full pl-14 pr-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-amber-900 mb-2">
                      Mật khẩu <span className="text-red-600">*</span>
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
                        disabled={authLoading}
                        className="w-full pl-14 pr-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
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
                        disabled={authLoading}
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
                    disabled={authLoading || isSendingOtp}
                    className="w-full bg-gradient-to-r from-amber-700 to-orange-600 text-white font-bold py-4 rounded-full hover:from-amber-800 hover:to-orange-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {authLoading
                      ? "Đang kiểm tra tài khoản..."
                      : isSendingOtp
                      ? "Đang gửi mã OTP..."
                      : "Đăng nhập"}
                  </button>
                </form>
              )}

              {/* Hỗ trợ */}
              <div className="text-center mt-8 text-sm text-amber-700">
                Cần hỗ trợ? Liên hệ{" "}
                <a
                  href="https://mail.google.com/mail/?view=cm&to=nguyentuananh11a1.lhpt@gmail.com&su=Tôi cần hỗ trợ&body=Xin chào..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium hover:text-amber-900"
                >
                  nguyentuananh11a1.lhpt@gmail.com
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

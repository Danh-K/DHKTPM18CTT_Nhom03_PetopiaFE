"use client";

import { useDispatch, useSelector } from "react-redux";
import { sendOtp, checkOtp, changePassword, resetForgotState } from "../store/forgotPasswordSlice";
import { useState } from "react";

export default function ForgotPasswordPage({ onBackToLogin }) {
  const dispatch = useDispatch();
  const { step, email, loading, error } = useSelector((s) => s.forgot);

  const [gmail, setGmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");

  const handleSendOtp = () => {
    dispatch(sendOtp(gmail));
  };

  const handleVerifyOtp = () => {
    dispatch(checkOtp({ email, otp }));
  };

  const handleResetPassword = () => {
    dispatch(changePassword({ email, newPassword: newPass }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-bold mb-4">Quên mật khẩu</h2>
            <input
              type="email"
              placeholder="Nhập email"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              className="w-full border rounded p-3 mb-4"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-orange-600 text-white p-3 rounded"
            >
              {loading ? "Đang gửi..." : "Gửi mã xác thực"}
            </button>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-xl font-bold mb-4">Nhập mã OTP</h2>
            <input
              type="text"
              placeholder="Mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded p-3 mb-4"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-orange-600 text-white p-3 rounded"
            >
              {loading ? "Đang xác minh..." : "Xác minh"}
            </button>
          </>
        );

      case 3:
        return (
          <>
            <h2 className="text-xl font-bold mb-4">Đặt mật khẩu mới</h2>
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full border rounded p-3 mb-4"
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-orange-600 text-white p-3 rounded"
            >
              {loading ? "Đang đổi..." : "Đổi mật khẩu"}
            </button>
          </>
        );

      case 4:
        return (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-green-600">Đổi mật khẩu thành công!</h2>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      {error && <p className="text-red-600 mb-3">{error}</p>}
      {renderStep()}
      <button onClick={onBackToLogin} className="text-sm mt-4 text-gray-700 underline">
        ← Quay lại đăng nhập
      </button>
    </div>
  );
}

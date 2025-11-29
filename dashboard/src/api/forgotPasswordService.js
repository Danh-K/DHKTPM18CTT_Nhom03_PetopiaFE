import api from "./authService";

// Gửi email yêu cầu OTP
export const requestOtp = async (email) => {
  const res = await api.post("api/auth/forgot-password", { email });
  return res.data;
};

// Xác minh mã OTP
export const verifyOtp = async (email, otp) => {
  const res = await api.post("api/auth/verify-otp", { email, otp });
  return res.data;
};

// Đổi mật khẩu mới
export const resetPassword = async (email, newPassword) => {
  const res = await api.post("api/auth/reset-password", { email, newPassword });
  return res.data;
};

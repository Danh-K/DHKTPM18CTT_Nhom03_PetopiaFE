import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 15000,
});

// Chống gửi token rác
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "undefined" && token !== "null" && token.trim()) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xóa token khi 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

// Hàm login
export const login = async (identifier, password) => {
  try {
    const res = await api.post("api/auth/login", { identifier, password });

    const token = res.data.accessToken;
    if (!token) throw new Error("Token không hợp lệ");

    return { token: token.trim(), user: res.data.user };
  } catch (error) {
    // Sai tài khoản/mật khẩu
    throw new Error("Thông tin đăng nhập không đúng");
  }
};

export default api;

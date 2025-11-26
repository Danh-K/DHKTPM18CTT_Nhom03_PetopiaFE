import axios from "axios";

// --- CẤU HÌNH ---
// 1. Dán Token của Admin mà bạn lấy được từ Postman vào đây
// Lưu ý: Token có hạn sử dụng (thường là 24h hoặc 7 ngày tùy backend config).
// Khi hết hạn, bạn cần login lại trên Postman để lấy token mới thay vào đây.
const HARD_CODED_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJ1c2VySWQiOiJVMDAzIiwic3ViIjoiYWRtaW5fcGV0c2hvcCIsImlhdCI6MTc2NDE0ODQ5MSwiZXhwIjoxNzY0MjM0ODkxfQ.2nDQMiYibyBz9ESIZpzEoz_Mo7NS3q0Nv2P2Rg5-vJg";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080", // Port backend Spring Boot
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Tự động gắn Token vào mọi Request
axiosClient.interceptors.request.use(async (config) => {
  // Ưu tiên lấy token từ LocalStorage (nếu sau này làm chức năng login thật)
  let token = localStorage.getItem("token");

  // Nếu không có token trong storage (chưa login), dùng token cứng của Admin
  if (!token) {
    token = HARD_CODED_TOKEN;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor: Xử lý phản hồi
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp để đỡ phải gõ .data nhiều lần ở component
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // Log lỗi ra console để dễ debug
      console.error("API Error:", error.response.data);
    }

    // Nếu lỗi 401 (Unauthorized) -> Token hết hạn hoặc sai
    if (error.response && error.response.status === 401) {
      alert(
        "Token Admin đã hết hạn hoặc không hợp lệ. Vui lòng lấy token mới từ Postman và dán lại vào axiosClient.js"
      );
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

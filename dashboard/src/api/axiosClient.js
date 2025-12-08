import axios from "axios";

// 1. Cấu hình chung cho Axios
// QUAN TRỌNG: Không để transformResponse ở đây nữa!
const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// 2. REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null" && token.trim()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 2. RESPONSE INTERCEPTOR (XỬ LÝ REFRESH TOKEN) ---
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 và chưa từng retry (để tránh vòng lặp vô tận)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu đã retry

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // Nếu không có refresh token thì logout luôn
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Gọi API Refresh Token
        // Lưu ý: Dùng instance axios mới hoặc fetch để tránh dính interceptor của chính nó
        const res = await axios.post(
          "http://localhost:8080/api/auth/refresh-token",
          {
            refreshToken: refreshToken,
          }
        );

        if (res.status === 200) {
          const { accessToken } = res.data; // Backend trả về accessToken mới

          // 1. Lưu token mới vào localStorage
          localStorage.setItem("token", accessToken);

          // 2. Gán token mới vào header của request cũ
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // 3. Thực hiện lại request cũ với token mới
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        // Nếu refresh cũng lỗi (hết hạn hoặc token đểu) -> Logout
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Đá về trang login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// // 3. RESPONSE INTERCEPTOR
// axiosClient.interceptors.response.use(
//   (response) => {
//     // Trả về data trực tiếp.
//     // Các API thường -> trả về Object/Array
//     // Riêng API Login (do cấu hình bên dưới) -> trả về String
//     return response.data;
//   },
//   (error) => {
//     console.error("Axios Error:", error);
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       // window.location.href = "/login"; // Bỏ comment nếu muốn tự động đá về login
//     }
//     return Promise.reject(error);
//   }
// );
export const login = async (identifier, password) => {
  try {
    // Chỉ riêng login ép response về TEXT để tự parse
    const raw = await axiosClient.post(
      "/api/auth/login",
      { identifier, password },
      {
        transformResponse: [(data) => data], // trả về string để tự xử lý
      }
    );

    console.log("📌 Raw Login Response:", raw);

    let accessToken = null;
    let refreshToken = null;
    let user = {};

    // Case 1: Backend trả về string -> dùng Regex
    if (typeof raw === "string") {
      const accessMatch = raw.match(/"accessToken"\s*:\s*"([^"]+)"/);
      const refreshMatch = raw.match(/"refreshToken"\s*:\s*"([^"]+)"/);

      accessToken = accessMatch ? accessMatch[1] : null;
      refreshToken = refreshMatch ? refreshMatch[1] : null;

      user = {
        userId: raw.match(/"userId"\s*:\s*"([^"]+)"/)?.[1] || "",
        role: raw.match(/"role"\s*:\s*"([^"]+)"/)?.[1] || "",
        username: raw.match(/"username"\s*:\s*"([^"]+)"/)?.[1] || identifier,
        email: raw.match(/"email"\s*:\s*"([^"]+)"/)?.[1] || "",
        avatar: raw.match(/"avatar"\s*:\s*"([^"]+)"/)?.[1] || "",
      };
    }

    // Case 2: Backend trả về object JSON đúng chuẩn
    else if (typeof raw === "object") {
      accessToken = raw.accessToken;
      refreshToken = raw.refreshToken;
      user = raw.user || {};
    }

    // Validate
    if (!accessToken) {
      throw new Error("Không thể lấy accessToken từ server");
    }

    return {
      accessToken,
      refreshToken,
      user,
    };
  } catch (error) {
    console.error("Login Error:", error);

    let message = "Thông tin đăng nhập không đúng";

    if (error.response?.data) {
      try {
        message = JSON.parse(error.response.data).message;
      } catch (_) {
        message = error.response.data;
      }
    }

    throw new Error(message);
  }
};

export default axiosClient;

// import axios from "axios";

// const HARD_CODED_TOKEN =
//   "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJ1c2VySWQiOiJVMDAzIiwic3ViIjoiYWRtaW5fcGV0c2hvcCIsImlhdCI6MTc2NDQxODQ0MywiZXhwIjoxNzY0NTA0ODQzfQ.F53y26L7GqPNB8cfBjZoCnq9rVJ6QKAgES-EpIRCO6Y";

// const axiosClient = axios.create({
//   baseURL: "http://localhost:8080", // Port backend Spring Boot
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// axiosClient.interceptors.request.use(async (config) => {
//   // Ưu tiên lấy token từ LocalStorage (nếu sau này làm chức năng login thật)
//   let token = localStorage.getItem("token");

//   // Nếu không có token trong storage (chưa login), dùng token cứng của Admin
//   if (!token) {
//     token = HARD_CODED_TOKEN;
//   }

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// // Interceptor: Xử lý phản hồi
// axiosClient.interceptors.response.use(
//   (response) => {
//     // Trả về data trực tiếp để đỡ phải gõ .data nhiều lần ở component
//     if (response && response.data) {
//       return response.data;
//     }
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       // Log lỗi ra console để dễ debug
//       console.error("API Error:", error.response.data);
//     }

//     // Nếu lỗi 401 (Unauthorized) -> Token hết hạn hoặc sai
//     if (error.response && error.response.status === 401) {
//       alert(
//         "Token Admin đã hết hạn hoặc không hợp lệ. Vui lòng lấy token mới từ Postman và dán lại vào axiosClient.js"
//       );
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosClient;

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

// 3. RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp.
    // Các API thường -> trả về Object/Array
    // Riêng API Login (do cấu hình bên dưới) -> trả về String
    return response.data;
  },
  (error) => {
    console.error("Axios Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.href = "/login"; // Bỏ comment nếu muốn tự động đá về login
    }
    return Promise.reject(error);
  }
);

// 4. Hàm Login (Cấu hình ĐẶC BIỆT chỉ dành riêng cho hàm này)
export const login = async (identifier, password) => {
  try {
    // Chỉ riêng request này ta ép nó trả về TEXT để xử lý JSON lỗi bằng Regex
    const res = await axiosClient.post(
      "/api/auth/login",
      { identifier, password },
      {
        // Cấu hình cục bộ: Ghi đè cách xử lý chỉ cho request này
        transformResponse: [(data) => data],
      }
    );

    console.log("📌 Raw Login Response:", res);

    let token = null;
    let user = {};

    // Logic Regex để gắp Token từ chuỗi lỗi
    if (typeof res === "string") {
      const tokenMatch = res.match(/"accessToken"\s*:\s*"([^"]+)"/);
      if (tokenMatch && tokenMatch[1]) token = tokenMatch[1];

      const userIdMatch = res.match(/"userId"\s*:\s*"([^"]+)"/);
      const roleMatch = res.match(/"role"\s*:\s*"([^"]+)"/);
      const nameMatch = res.match(/"fullName"\s*:\s*"([^"]+)"/);
      const emailMatch = res.match(/"email"\s*:\s*"([^"]+)"/);
      const avatarMatch = res.match(/"avatar"\s*:\s*"([^"]+)"/);

      user = {
        userId: userIdMatch ? userIdMatch[1] : "",
        role: roleMatch ? roleMatch[1] : "USER",
        fullName: nameMatch ? nameMatch[1] : "User",
        email: emailMatch ? emailMatch[1] : identifier,
        avatar: avatarMatch ? avatarMatch[1] : "",
      };
    } else if (typeof res === "object") {
      // Phòng hờ trường hợp backend trả về đúng
      token = res.accessToken || res.token;
      user = res.user || {};
    }

    if (!token) throw new Error("Không thể trích xuất Token");

    return { token: token.trim(), user: user };
  } catch (error) {
    console.error("Login Error:", error);
    if (error.response) {
      // Parse lại lỗi từ server vì nó đang là string
      try {
        const errData = JSON.parse(error.response.data);
        throw new Error(errData.message || "Thông tin đăng nhập không đúng");
      } catch (e) {
        throw new Error("Thông tin đăng nhập không đúng");
      }
    }
    throw new Error(error.message);
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

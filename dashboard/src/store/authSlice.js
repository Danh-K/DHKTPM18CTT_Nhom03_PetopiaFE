import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../api/axiosClient";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const { user, accessToken, refreshToken } = await login(
        identifier,
        password
      );

      if (!user?.role || user.role.toUpperCase() !== "ADMIN") {
        return rejectWithValue(
          "Bạn không có quyền truy cập trang quản trị. Chỉ dành cho Admin."
        );
      }

      return { user, accessToken, refreshToken };
    } catch (err) {
      return rejectWithValue(
        err.message || "Tên đăng nhập hoặc mật khẩu không đúng"
      );
    }
  }
);

const loadFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined" || item === "null") return null;
    return key === "user" ? JSON.parse(item) : item;
  } catch {
    return null;
  }
};

const initialState = {
  user: loadFromStorage("user"),
  token: loadFromStorage("token"),
  refreshToken: localStorage.getItem("refreshToken") || null,
  loading: false,
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action dùng khi login thành công (hoặc verify OTP thành công)
    setLoginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      // Lưu vào LocalStorage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken); // Lưu refresh token
    },
    // Action dùng khi Refresh Token thành công (chỉ cập nhật token mới)
    tokenRefreshed: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tempLoginData = {
          user: action.payload.user,
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//     },
//     setLoginSuccess: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       localStorage.setItem("user", JSON.stringify(action.payload.user));
//       localStorage.setItem("token", action.payload.token);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         // state.user = action.payload.user;
//         // state.token = action.payload.token;
//         // localStorage.setItem("user", JSON.stringify(action.payload.user));
//         // localStorage.setItem("token", action.payload.token);
//         state.tempLoginData = action.payload;
//       })
//       .addCase(loginUser.rejected, (state) => {
//         state.loading = false;
//         state.error = "Thông tin đăng nhập không đúng";
//       });
//   },
// });

export const { logout, setLoginSuccess } = authSlice.actions;
export default authSlice.reducer;

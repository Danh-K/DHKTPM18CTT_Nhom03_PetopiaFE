import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../api/authService";


export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const { user, token } = await login(identifier, password);

      if (!user?.role || user.role.toUpperCase() !== "ADMIN") {
        return rejectWithValue("Bạn không có quyền truy cập trang quản trị. Chỉ dành cho Admin.");
      }

      return { user, token };
    } catch (err) {
      return rejectWithValue(err.message || "Tên đăng nhập hoặc mật khẩu không đúng");
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
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
        state.error = "Thông tin đăng nhập không đúng";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
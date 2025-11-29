import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { requestOtp, verifyOtp, resetPassword } from "../api/forgotPasswordService";

// Gửi email
export const sendOtp = createAsyncThunk(
  "forgot/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      await requestOtp(email);
      return email;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Email không tồn tại");
    }
  }
);

// Xác minh mã OTP
export const checkOtp = createAsyncThunk(
  "forgot/checkOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      await verifyOtp(email, otp);
      return true;
    } catch (err) {
      return rejectWithValue("Mã OTP không đúng");
    }
  }
);

// Đổi mật khẩu
export const changePassword = createAsyncThunk(
  "forgot/changePassword",
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      await resetPassword(email, newPassword);
      return true;
    } catch (err) {
      return rejectWithValue("Không thể đổi mật khẩu");
    }
  }
);

const forgotSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    step: 1,
    email: "",
    otpVerified: false,
    loading: false,
    error: null,
  },
  reducers: {
    resetForgotState: (state) => {
      state.step = 1;
      state.email = "";
      state.otpVerified = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(sendOtp.fulfilled, (s, a) => {
        s.loading = false;
        s.email = a.payload;
        s.step = 2;
      })
      .addCase(sendOtp.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(checkOtp.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(checkOtp.fulfilled, (s) => {
        s.loading = false;
        s.otpVerified = true;
        s.step = 3;
      })
      .addCase(checkOtp.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(changePassword.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(changePassword.fulfilled, (s) => {
        s.loading = false;
        s.step = 4;
      })
      .addCase(changePassword.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const { resetForgotState } = forgotSlice.actions;
export default forgotSlice.reducer;

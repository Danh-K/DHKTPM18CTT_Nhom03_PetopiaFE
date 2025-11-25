import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import forgotReducer from "./forgotPasswordSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forgot: forgotReducer,
  },
})
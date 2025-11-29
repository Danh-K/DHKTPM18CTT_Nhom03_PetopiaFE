import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import forgotReducer from "./forgotPasswordSlice"
import promotionReducer from "./promotionSlice"
import deliveryReducer from "./deliverySlice"
import voucherReducer from "./voucherSlice";
import userReducer from "./userSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forgot: forgotReducer,
    promotion: promotionReducer,
    delivery: deliveryReducer,
    voucher: voucherReducer,
    user: userReducer,
  },
})
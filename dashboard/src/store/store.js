import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import forgotReducer from "./forgotPasswordSlice"
import promotionReducer from "./promotionSlice"
import deliveryReducer from "./deliverySlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forgot: forgotReducer,
    promotion: promotionReducer,
    delivery: deliveryReducer,
  },
})
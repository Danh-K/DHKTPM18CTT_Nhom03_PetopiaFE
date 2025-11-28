import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { deliveryService } from "../api/deliveryService"

export const fetchDeliveries = createAsyncThunk( "delivery/fetchDeliveries", async ({ page = 0, size = 9 }, { rejectWithValue }) => {
    try {
      const data = await deliveryService.getAll(page, size)
      return data
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi tải lịch sử giao hàng")
    }
  },
)

export const fetchDeliveryById = createAsyncThunk("delivery/fetchById", async (deliveryId, { rejectWithValue }) => {
  try {
    const data = await deliveryService.getById(deliveryId)
    return data
  } catch (error) {
    return rejectWithValue(error.message || "Không tìm thấy đơn hàng")
  }
})

export const updateDeliveryStatus = createAsyncThunk( "delivery/updateStatus", async ({ deliveryId, status }, { rejectWithValue }) => {
    try {
      const data = await deliveryService.updateStatus(deliveryId, status)
      return data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const searchDeliveries = createAsyncThunk( "delivery/searchDeliveries", async ({ query, status, page = 0, size = 9 }, { rejectWithValue }) => {
    try {
      const data = await deliveryService.search(query, status, page, size);
      return { ...data, query, status };
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi tìm kiếm");
    }
  }
);

const initialState = {
  deliveries: [],
  selectedDelivery: null,
  loading: false,
  error: null,
  currentPage: 0,
  pageSize: 9,
  totalElements: 0,
  totalPages: 0,
  searchQuery: "",
}

const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveries.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.loading = false
        state.deliveries = action.payload.content || []
        state.totalElements = action.payload.totalElements || 0
        state.currentPage = action.payload.page || 0
        state.pageSize = action.payload.size || 9

        const calculatedTotalPages = state.totalElements > 0 
            ? Math.ceil(state.totalElements / state.pageSize) 
            : 1

        state.totalPages = action.payload.totalPages ?? calculatedTotalPages
        })
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchDeliveryById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDeliveryById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedDelivery = action.payload
      })
      .addCase(fetchDeliveryById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        const updated = action.payload
        const index = state.deliveries.findIndex(d => d.deliveryId === updated.deliveryId)
        if (index !== -1) {
            state.deliveries[index] = updated
        }
      })
      .addCase(searchDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries = action.payload.content || [];
        state.totalElements = action.payload.totalElements || 0;
        state.totalPages = (action.payload.totalElements / state.pageSize) > 0
          ? Math.ceil(action.payload.totalElements / state.pageSize)
          : 1;
        state.currentPage = action.payload.page || 0;
        state.searchQuery = action.payload.query || "";
      })
      .addCase(searchDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
})

export const { clearError, setCurrentPage } = deliverySlice.actions
export default deliverySlice.reducer

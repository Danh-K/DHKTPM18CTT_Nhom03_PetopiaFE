import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { userService } from "../api/userService"

export const fetchUsers = createAsyncThunk("user/fetchAll", async ({ page = 0, size = 10 }, { rejectWithValue }) => {
  try {
    const response = await userService.getAll(page, size)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || "Lỗi tải danh sách người dùng")
  }
})

export const searchUsers = createAsyncThunk("user/search", async (filters, { rejectWithValue }) => {
  try {
    const response = await userService.search(filters)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || "Lỗi tìm kiếm")
  }
})

export const updateUser = createAsyncThunk("user/update", async ({ userId, userData }, { rejectWithValue }) => {
  try {
    const data = await userService.updateUser(userId, userData)
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || "Lỗi cập nhật")
  }
})

const userSlice = createSlice({
  name: "user",
  initialState: {
    list: [],
    totalElements: 0,
    currentPage: 1,
    size: 10,
    loading: false,
    error: null,
    isSearching: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.content || []
        state.totalElements = action.payload.totalElements || 0
        state.currentPage = (action.payload.page ?? 0) + 1
        state.size = action.payload.size || 10
        state.isSearching = false
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.content || []
        state.totalElements = action.payload.totalElements || 0
        state.currentPage = (action.payload.page ?? 0) + 1
        state.size = action.payload.size || 10
        state.isSearching = true
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        const index = state.list.findIndex((u) => u.userId === action.payload.userId)
        if (index !== -1) {
          state.list[index] = action.payload
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setCurrentPage } = userSlice.actions
export default userSlice.reducer

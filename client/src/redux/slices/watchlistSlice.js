import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { watchlistService } from '../../services/api/watchlistService'

const initialState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
}

export const fetchWatchlistAsync = createAsyncThunk(
  'watchlist/fetchWatchlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await watchlistService.getWatchlist()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch watchlist')
    }
  }
)

export const addToWatchlistAsync = createAsyncThunk(
  'watchlist/addToWatchlist',
  async (listingId, { rejectWithValue }) => {
    try {
      const response = await watchlistService.addToWatchlist(listingId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to watchlist')
    }
  }
)

export const removeFromWatchlistAsync = createAsyncThunk(
  'watchlist/removeFromWatchlist',
  async (listingId, { rejectWithValue }) => {
    try {
      await watchlistService.removeFromWatchlist(listingId)
      return listingId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from watchlist')
    }
  }
)

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlistAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWatchlistAsync.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items || []
        state.total = action.payload.total || 0
      })
      .addCase(fetchWatchlistAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(addToWatchlistAsync.pending, (state) => {
        state.error = null
      })
      .addCase(addToWatchlistAsync.fulfilled, (state, action) => {
        if (!state.items.find(item => item._id === action.payload._id)) {
          state.items.push(action.payload)
          state.total += 1
        }
      })
      .addCase(addToWatchlistAsync.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(removeFromWatchlistAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload)
        state.total = Math.max(0, state.total - 1)
      })
      .addCase(removeFromWatchlistAsync.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearError } = watchlistSlice.actions
export default watchlistSlice.reducer

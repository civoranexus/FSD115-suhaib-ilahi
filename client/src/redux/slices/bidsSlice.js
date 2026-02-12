import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { bidsService } from '../../services/api/bidsService'

const initialState = {
  items: [],
  selectedBid: null,
  listingBids: [],
  myBids: [],
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0 },
}

export const fetchBidsAsync = createAsyncThunk(
  'bids/fetchBids',
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await bidsService.getBids(page, limit)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bids')
    }
  }
)

export const fetchListingBidsAsync = createAsyncThunk(
  'bids/fetchListingBids',
  async (listingId, { rejectWithValue }) => {
    try {
      const response = await bidsService.getListingBids(listingId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch listing bids')
    }
  }
)

export const fetchMyBidsAsync = createAsyncThunk(
  'bids/fetchMyBids',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await bidsService.getMyBids(page, limit)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my bids')
    }
  }
)

export const placeBidAsync = createAsyncThunk(
  'bids/placeBid',
  async ({ listingId, amount }, { rejectWithValue }) => {
    try {
      const response = await bidsService.placeBid(listingId, amount)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to place bid')
    }
  }
)

export const withdrawBidAsync = createAsyncThunk(
  'bids/withdrawBid',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await bidsService.withdrawBid(bidId)
      return response.data.data || { id: bidId }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to withdraw bid')
    }
  }
)

const bidsSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    addBidOptimistic: (state, action) => {
      state.listingBids.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBidsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBidsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data || []
        state.pagination = action.payload.pagination || initialState.pagination
      })
      .addCase(fetchBidsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchListingBidsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchListingBidsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.listingBids = action.payload.data || []
      })
      .addCase(fetchListingBidsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMyBidsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyBidsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.myBids = action.payload.data || []
        state.pagination = action.payload.pagination || initialState.pagination
      })
      .addCase(fetchMyBidsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(placeBidAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(placeBidAsync.fulfilled, (state, action) => {
        state.loading = false
        state.selectedBid = action.payload
        if (action.payload) state.myBids.unshift(action.payload)
      })
      .addCase(placeBidAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(withdrawBidAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(withdrawBidAsync.fulfilled, (state, action) => {
        state.loading = false
        const id = action.payload?.id || action.payload?._id
        state.myBids = state.myBids.filter(bid => (bid.id || bid._id) !== id)
        state.listingBids = state.listingBids.filter(bid => (bid.id || bid._id) !== id)
      })
      .addCase(withdrawBidAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, addBidOptimistic } = bidsSlice.actions
export default bidsSlice.reducer

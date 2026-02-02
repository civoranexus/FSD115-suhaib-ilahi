import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { listingsService } from '../../services/api/listingsService'

const initialState = {
  items: [],
  selectedListing: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0 },
  hasMore: true,
}

export const fetchListingsAsync = createAsyncThunk(
  'listings/fetchListings',
  async ({ page = 1, limit = 20, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await listingsService.getListings(page, limit, filters)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch listings')
    }
  }
)

export const fetchListingByIdAsync = createAsyncThunk(
  'listings/fetchListingById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await listingsService.getListingById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch listing')
    }
  }
)

export const createListingAsync = createAsyncThunk(
  'listings/createListing',
  async (listingData, { rejectWithValue }) => {
    try {
      const response = await listingsService.createListing(listingData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create listing')
    }
  }
)

export const updateListingAsync = createAsyncThunk(
  'listings/updateListing',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await listingsService.updateListing(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update listing')
    }
  }
)

export const deleteListingAsync = createAsyncThunk(
  'listings/deleteListing',
  async (id, { rejectWithValue }) => {
    try {
      await listingsService.deleteListing(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete listing')
    }
  }
)

export const fetchMyListingsAsync = createAsyncThunk(
  'listings/fetchMyListings',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await listingsService.getMyListings(page, limit)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my listings')
    }
  }
)

const listingsSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSelectedListing: (state) => {
      state.selectedListing = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListingsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchListingsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.listings || []
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          total: action.payload.total || 0,
        }
        state.hasMore = (action.payload.page * action.payload.limit) < action.payload.total
      })
      .addCase(fetchListingsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchListingByIdAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchListingByIdAsync.fulfilled, (state, action) => {
        state.loading = false
        state.selectedListing = action.payload
      })
      .addCase(fetchListingByIdAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createListingAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createListingAsync.fulfilled, (state, action) => {
        state.loading = false
        state.items.unshift(action.payload)
      })
      .addCase(createListingAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateListingAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateListingAsync.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex(item => item._id === action.payload._id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.selectedListing?._id === action.payload._id) {
          state.selectedListing = action.payload
        }
      })
      .addCase(updateListingAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteListingAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteListingAsync.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(item => item._id !== action.payload)
      })
      .addCase(deleteListingAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMyListingsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyListingsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.listings || []
        state.pagination = action.payload.pagination || initialState.pagination
      })
      .addCase(fetchMyListingsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearSelectedListing } = listingsSlice.actions
export default listingsSlice.reducer

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { listingsService } from '../../services/api/listingsService'

const initialState = {
  query: '',
  results: [],
  recentSearches: JSON.parse(localStorage.getItem('recentSearches') || '[]'),
  loading: false,
  error: null,
}

export const searchListingsAsync = createAsyncThunk(
  'search/searchListings',
  async (query, { rejectWithValue }) => {
    try {
      const response = await listingsService.searchListings(query)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed')
    }
  }
)

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload
    },
    addRecentSearch: (state, action) => {
      const search = action.payload
      state.recentSearches = state.recentSearches.filter(s => s !== search)
      state.recentSearches.unshift(search)
      if (state.recentSearches.length > 10) {
        state.recentSearches.pop()
      }
      localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches))
    },
    clearRecentSearches: (state) => {
      state.recentSearches = []
      localStorage.removeItem('recentSearches')
    },
    clearSearchResults: (state) => {
      state.results = []
      state.query = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchListingsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchListingsAsync.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload.results || []
      })
      .addCase(searchListingsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  setSearchQuery,
  addRecentSearch,
  clearRecentSearches,
  clearSearchResults,
} = searchSlice.actions

export default searchSlice.reducer

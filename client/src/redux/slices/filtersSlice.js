import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  category: '',
  condition: '',
  priceRange: { min: 0, max: 100000 },
  sortBy: 'newest',
  status: 'active',
  location: '',
  rating: 0,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload
    },
    setCondition: (state, action) => {
      state.condition = action.payload
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setStatus: (state, action) => {
      state.status = action.payload
    },
    setLocation: (state, action) => {
      state.location = action.payload
    },
    setRating: (state, action) => {
      state.rating = action.payload
    },
    setMultipleFilters: (state, action) => {
      return { ...state, ...action.payload }
    },
    resetFilters: (state) => {
      return initialState
    },
  },
})

export const {
  setCategory,
  setCondition,
  setPriceRange,
  setSortBy,
  setStatus,
  setLocation,
  setRating,
  setMultipleFilters,
  resetFilters,
} = filtersSlice.actions

export default filtersSlice.reducer

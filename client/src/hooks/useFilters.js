import { useDispatch, useSelector } from 'react-redux'
import {
  setCategory,
  setCondition,
  setPriceRange,
  setSortBy,
  setStatus,
  setLocation,
  setRating,
  setMultipleFilters,
  resetFilters,
} from '../redux/slices/filtersSlice'

export const useFilters = () => {
  const dispatch = useDispatch()
  const filters = useSelector(state => state.filters)

  return {
    category: filters.category,
    condition: filters.condition,
    priceRange: filters.priceRange,
    sortBy: filters.sortBy,
    status: filters.status,
    location: filters.location,
    rating: filters.rating,
    setCategory: (category) => dispatch(setCategory(category)),
    setCondition: (condition) => dispatch(setCondition(condition)),
    setPriceRange: (range) => dispatch(setPriceRange(range)),
    setSortBy: (sort) => dispatch(setSortBy(sort)),
    setStatus: (status) => dispatch(setStatus(status)),
    setLocation: (location) => dispatch(setLocation(location)),
    setRating: (rating) => dispatch(setRating(rating)),
    setMultipleFilters: (filterObj) => dispatch(setMultipleFilters(filterObj)),
    resetFilters: () => dispatch(resetFilters()),
  }
}

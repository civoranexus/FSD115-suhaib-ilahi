import { useDispatch, useSelector } from 'react-redux'
import { searchListingsAsync } from '../redux/slices/searchSlice'
import {
  setSearchQuery,
  addRecentSearch,
  clearRecentSearches,
  clearSearchResults,
} from '../redux/slices/searchSlice'

export const useSearch = () => {
  const dispatch = useDispatch()
  const search = useSelector(state => state.search)

  const searchListings = (query) => {
    return dispatch(searchListingsAsync(query))
  }

  const setQuery = (query) => {
    dispatch(setSearchQuery(query))
  }

  const addToRecent = (query) => {
    dispatch(addRecentSearch(query))
  }

  const clearRecent = () => {
    dispatch(clearRecentSearches())
  }

  const clearResults = () => {
    dispatch(clearSearchResults())
  }

  return {
    query: search.query,
    results: search.results,
    recentSearches: search.recentSearches,
    loading: search.loading,
    error: search.error,
    searchListings,
    setQuery,
    addToRecent,
    clearRecent,
    clearResults,
  }
}
